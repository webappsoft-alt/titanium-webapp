'use client'
import { Button } from '@/components/ui/button';
import { Select, SelectOption } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import ApiFunction from '@/lib/api/apiFuntions';
import { useEffect, useState } from 'react';
import { Spinner } from '../ui/spinner';

export function QuoteFilterForm({ setFilterData, isCustomer = false, isOrder, filterData }) {
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
  };
  useEffect(() => {
    handleGetTerritories()
  }, []);
  useEffect(() => {
    if (!filterData)
      setFormData(null)
  }, [filterData]);
  return (
    <>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className='grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1'>

          <div>
            <Label htmlFor="startDate">Date created - from</Label>
            <Input type='date' name="startDate" value={formData?.startDate || ''} placeholder="Date created - from" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="endDate">Date created - to</Label>
            <Input type='date' name="endDate" value={formData?.endDate || ''} placeholder="Date created - to" onChange={handleChange} />
          </div>
          {isOrder ?
            <div>
              <Label htmlFor="orderNo">{'Order#'}</Label>
              <Input name="orderNo" value={formData?.orderNo || ''} placeholder={'Order#'} onChange={handleChange} />
            </div> :
            <div>
              <Label htmlFor="quoteNo">{'Quote#'}</Label>
              <Input name="quoteNo" value={formData?.quoteNo || ''} placeholder={'Quote#'} onChange={handleChange} />
            </div>}
          {!isCustomer &&
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input name="email" value={formData?.email || ''} placeholder="Your Email Address" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="fname">First Name</Label>
                <Input name="fname" value={formData?.fname || ''} placeholder="First Name" onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="lname">Last Name</Label>
                <Input name="lname" value={formData?.lname || ''} placeholder="Last Name" onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input name="company" value={formData?.company || ''} placeholder="Company" onChange={handleChange} />
              </div>
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
            </>}
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