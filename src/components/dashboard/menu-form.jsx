import React, { useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";
import { FormFeedback } from "../ui/formFeedBack";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
    selectedLabel: yup.object().required("Please select a menu item"),
    path: yup.string().url("Path must be a valid URL").required("Path is required"),
});

const MenuForm = () => {
    const menuData = useSelector((state) => state.menu.items) || [];
    const excludeMenu = ['PIPE AND FITTINGS', 'MILL PRODUCTS']
    const [selectLabel, setSelectLabel] = useState(null);
    const filterMenu = menuData?.filter(item => !excludeMenu.includes(item?.label)) || []
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            selectedLabel: null,
            path: "",
        },
    });
    const onSubmit = (formData) => {
        const updatePath = (items) => {
            return items.map((item) => {
                if (item.label === formData.selectedLabel.value) {
                    return { ...item, path: formData.path };
                }
                if (item.children) {
                    return { ...item, children: updatePath(item.children) };
                }
                return item;
            });
        };

        setData(updatePath(data));
        reset();
    };
    return (
        <div className="space-y-6 mt-2">
            <div>
                <h1 className="text-2xl font-bold">Update Path for Menu Item</h1>
                <p className="text-gray-600">Review and manage Navigation Menu</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Select
                    options={filterMenu}
                    placeholder="Select a menu item"
                    value={selectLabel}
                    onChange={(option) => setSelectLabel(option)}
                />
                <h1 className="text-lg font-bold mt-3" style={{ textTransform: 'capitalize' }}>{selectLabel?.label}</h1>
                {selectLabel?.children?.map((item, index) => (
                    <div className="mb-3">
                        <div key={index} className="grid grid-cols-2 gap-3 items-center">
                            <div className="">
                                <label className="block text-sm font-medium mb-1">Label</label>
                                <Controller
                                    name="label"
                                    control={control}
                                    defaultValue={item?.label}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter Label"
                                        />
                                    )}
                                />
                                {errors.label && <FormFeedback>{errors.label.message}</FormFeedback>}
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium mb-1">Path</label>
                                <Controller
                                    name="path"
                                    control={control}
                                    defaultValue={item?.value}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter path"
                                        />
                                    )}
                                />
                                {errors.path && <FormFeedback>{errors.path.message}</FormFeedback>}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="mt-3">
                    <Button type="submit">
                        Update Path
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;
