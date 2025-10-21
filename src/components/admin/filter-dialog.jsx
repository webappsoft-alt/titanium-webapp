'use client'
import { Button } from '@/components/ui/button';
import { Select, SelectOption } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import ApiFunction from '@/lib/api/apiFuntions';
import { useEffect, useState } from 'react';
import { Spinner } from '../ui/spinner';

const industry = ["Aerospace", "Defense", "Industrial", "Medical", "Oil / Gas", "Other"];

export function UserFilterForm({ setFilterData, isTitanium = false, filterType = '', filterData }) {
  const { post, put, get } = ApiFunction();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [territoriesList, setTerritoriesList] = useState([]);

  const handleGetTerritories = async (pageNo = 1) => {
    await get(`territories/all`)
      .then((result) => {
        if (result.success) {
          setTerritoriesList(result.territories)
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
      })
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFilterData(formData)
    // onClose()
    // Handle form submission
  };
  useEffect(() => {
    handleGetTerritories()
  }, []);
  useEffect(() => {
    if (!filterData) {
      setFormData(null)
    }
  }, [filterData]);

  return (
    <>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className='grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1'>
          <div>
            <Label htmlFor="fname">First Name</Label>
            <Input name="fname" value={formData?.fname || ''} placeholder="First Name" onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="lname">Last Name</Label>
            <Input name="lname" value={formData?.lname || ''} placeholder="Last Name" onChange={handleChange} />
          </div>


          <div>
            <Label htmlFor="email">Email</Label>
            <Input name="email" value={formData?.email || ''} placeholder="Your Email Address" onChange={handleChange} />
          </div>
          {!isTitanium ?
            <>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input name="company" value={formData?.company || ''} placeholder="Company" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select defaultValue="" name="industry" value={formData?.industry} onChange={handleChange}>
                  <SelectOption disabled value="">Select Industry</SelectOption>
                  {industry.map((item, index) => (
                    <SelectOption key={index} value={item}>{item}</SelectOption>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="stratixAccount">Stratix</Label>
                <Input name="stratixAccount" value={formData?.stratixAccount || ''} placeholder="Stratix" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="assignBranch">Branch</Label>
                <Select
                  name="assignBranch"
                  value={formData?.assignBranch || ''}
                  defaultValue=""
                  onChange={handleChange}>
                  <SelectOption disabled value="">Select Branch</SelectOption>
                  {territoriesList?.map((item, index) => (
                    <SelectOption key={index} value={item?._id}>{item?.code}</SelectOption>
                  ))}
                </Select>
              </div>
            </> :
            <>
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Select
                  name="branch"
                  value={formData?.branch || ''}
                  defaultValue=""
                  onChange={handleChange}>
                  <SelectOption disabled value="">Select Branch</SelectOption>
                  {territoriesList?.map((item, index) => (
                    <SelectOption key={index} value={item?._id}>{item?.code}</SelectOption>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="routing">Routing</Label>
                <Select
                  name="routing"
                  value={formData?.routing || ''}
                  defaultValue=""
                  onChange={handleChange}>
                  <SelectOption disabled value="">Select Routing</SelectOption>
                  {territoriesList?.map((item, index) => (
                    <SelectOption key={index} value={item?._id}>{item?.code}</SelectOption>
                  ))}
                </Select>
              </div>
            </>
          }

          <div>
            <Label htmlFor="startDate">Date created - from</Label>
            <Input type='date' name="startDate" value={formData?.startDate || ''} placeholder="Date created - from" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="endDate">Date created - to</Label>
            <Input type='date' name="endDate" value={formData?.endDate || ''} placeholder="Date created - to" onChange={handleChange} />
          </div>
        </div>
        <div className='flex gap-3'>
          <Button type="submit" size='sm' disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Apply Filters'}
          </Button>
          <Button onClick={() => {
            setFilterData(null)
            setFormData(null)
          }} variant='outline' type="reset" size='sm' disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Reset All'}
          </Button>
        </div>
      </form>
    </>
  );
}