'use client'
/* eslint-disable multiline-ternary */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiFunction from "@/lib/api/apiFuntions";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Edit, Plus, TrashIcon } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { usePathname, useRouter } from "next/navigation";

const pageContentArray = [
  { value: 'terms-condition', label: 'Terms & Condition' },
  { value: 'faqs', label: 'FAQs Content' },
]

const StaticPageList = () => {
  const [staticPageData, setStaticPageContent] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [rowData, setRowData] = useState(null);
  const pathname = usePathname()
  const { push } = useRouter()
  const [isloading2, setIsloading2] = useState(false);
  const { put, post, get, deleteData } = ApiFunction()
  const selectType = pageContentArray?.find(item => pathname.endsWith(item.value))
  const toggleSidebar = (row) => {
    setOpen(!open);
    if (row) {
      setRowData(row);
    }
  };
  const toggleDel = (row) => {
    setOpenDel(!openDel);
    if (row) {
      setRowData(row);
    }
  };
  const handleUpdateOrder = async (updatedData) => {
    await put(`static-pages/indexOrder`, { staticPageData: updatedData })
      .then((result) => {
      }).catch((err) => {
        console.log(err)
      });
  }
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedData = Array.from(staticPageData);
    const [movedItem] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, movedItem);

    // Assign new orderIndex values based on the new order
    const updatedData = reorderedData.map((item, index) => ({
      ...item,
      orderIndex: index,
    }));

    setStaticPageContent(updatedData); // Update state
    handleUpdateOrder(updatedData)
  };

  const getTermConditions = async () => {
    setIsloading2(true);

    const apiGet = `static-pages/admin/${selectType?.value}`

    await get(apiGet)
      .then((result) => {
        if (result.success) {
          setStaticPageContent(result.staticPage);
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setIsloading2(false);
      });
  };
  const HandleDell = async (_id) => {
    setIsloading(true);
    await deleteData(`static-pages/${_id}`)
      .then((result) => {
        toast.success(result?.message);
        getTermConditions()
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  useEffect(() => {
    getTermConditions();
  }, [pathname])

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Static Page Content</h1>
          <p className="text-gray-600">Review and manage static content</p>
          <div className="flex gap-1 justify-end mt-2">
            <Button
              type="submit"
              variant="outline"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => push(`/dashboard/static/${selectType?.value}`)}
            >
              <Plus size={16} className="me-2" /> Add {selectType?.label}
            </Button>
          </div>
        </div>

        {isloading2 ? <div className="text-center flex justify-center py-4"><Spinner /></div> :
          selectType?.value === 'faqs' ?
            <>
              {/* <div className="space-y-6">
                {staticPageData?.length > 0 && staticPageData?.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <p className="font-medium text-gray-800 mb-2">{index + 1}. {item?.faqs?.question}</p>
                    <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: item?.faqs?.answer }}></div>
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        disabled={isloading}
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => push( `/dashboard/static/${selectType?.value}?query=${item?._id}`)}
                      >
                        <Edit size={16} className="" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ms-2"
                        disabled={isloading}
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => HandleDell(item?._id)}
                      >
                        {isloading ? <Spinner size="sm" /> : <TrashIcon size={16} className="" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div> */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="faqs">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-6"
                    >
                      {staticPageData?.length > 0 &&
                        staticPageData.map((item, index) => (
                          <Draggable key={item?._id} draggableId={item?._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border-b border-gray-200 pb-4"
                              >
                                <p className="font-medium text-gray-800 mb-2">
                                  {index + 1}. {item?.faqs?.question}
                                </p>
                                <div
                                  className="text-gray-600"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.faqs?.answer,
                                  }}
                                ></div>
                                <div className="flex justify-end mt-3">
                                  <Button
                                    size="sm"
                                    disabled={isloading}
                                    style={{ whiteSpace: "nowrap" }}
                                    onClick={() =>
                                      push(`/dashboard/static/${selectType?.value}?query=${item?._id}`)
                                    }
                                  >
                                    <Edit size={16} className="" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="ms-2"
                                    disabled={isloading}
                                    style={{ whiteSpace: "nowrap" }}
                                    onClick={() => HandleDell(item?._id)}
                                  >
                                    {isloading ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <TrashIcon size={16} className="" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

            </> :
            <>
              {staticPageData ?
                <div dangerouslySetInnerHTML={{ __html: staticPageData?.detail }} ></div> :
                <p>{selectType?.label} not found!</p>}
              {staticPageData &&
                <div className="d-flex gap-1">
                  <Button
                    type="submit"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => push(`/dashboard/static/${selectType?.value}?query=${staticPageData?._id}`)}
                  >
                    <Edit size={16} className="me-2" /> Edit
                  </Button>
                </div>}
            </>}
      </div>
    </>
  );
};

export default StaticPageList;
