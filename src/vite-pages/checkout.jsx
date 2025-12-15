'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CaretRightOutlined } from '@ant-design/icons';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { removeTableData, setTableData } from '@/lib/redux/products';
import { useDispatch, useSelector } from 'react-redux';
import ApiFunction from '@/lib/api/apiFuntions';
import { X } from 'lucide-react';
import SpinnerOverlay from '@/components/ui/spinnerOverlay';
import { CheckoutAddress } from './checkoutAddress';
import { Collapse } from 'antd';
import { PaymentCard } from './paymentCard';
import { setCheckoutData } from '@/lib/redux/checkout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FormFeedback } from '@/components/ui/formFeedBack';

const schema = z
  .object({
    fname: z.string({ required_error: 'First name is required' }),
    company: z.string({ required_error: 'Company name is required' }),
    lname: z.string().min(0),
    phone: z.string({ required_error: 'Phone Number is required' }),
    address1: z.string({ required_error: 'Address is required' }),
    address2: z.string().min(0).optional(),
    country: z.string({ required_error: 'Country is required' }),
    zipCode: z.string({ required_error: 'Zip Code is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
  })
export function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const { deleteData, post, get } = ApiFunction()
  const dispatch = useDispatch()
  const state = null
  const userData = useSelector(state => state.auth.userData)
  const tableData = useSelector(state => state.prod.tableData)
  const checkoutData = useSelector(state => state.checkout.checkoutData)
  const [quoteData, setQuoteData] = useState(null);
  const [isActive, setIsActive] = useState('1');
  const { push } = useRouter();
  const [isCartLoading, setIsCartLoading] = useState(true);
  const panelStyle = {
    marginBottom: 18,
    background: '#fff',
    borderRadius: 20,
    border: 'none',
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  function calculateTax(amount, taxPercent) {
    const taxAmount = (amount * taxPercent) / 100;
    return taxAmount;
  }
  const calculateTotalPrice = (data, discount = "0") => {
    const totalPrice = data?.reduce((total, item) => {
      const subtotal = Number(item?.prices?.price || 0) * Number(item?.quantity || 0);
      return total + subtotal;
    }, 0) || 0;

    // Convert discount string to a number (handles cases like "+10", "-10", "0")
    const discountValue = parseFloat(discount) || 0;

    // Adjust the total price based on the discount percentage
    const adjustedPrice = totalPrice + (totalPrice * (discountValue / 100));

    return adjustedPrice;
  };
  const totalAmount = calculateTotalPrice(tableData, userData?.discount || "0")
  const taxAmount = calculateTax(totalAmount, 0)
  const isBelowMinimum = totalAmount < 150;
  const handleRemove = async (i, item) => {
    dispatch(removeTableData(i))
    await deleteData(`cart/${item?._id}`)
      .then((result) => {

      }).catch((err) => {
        console.log(err)
      });
  }

  const onSubmitQuote = async (e) => {
    e.preventDefault()
    dispatch(setCheckoutData({ quote: tableData, notes, totalAmount: (taxAmount + totalAmount), subtotal: totalAmount, tax: taxAmount, type: 'cart' }))
    setIsActive('2')
  }
  const handleGetCart = async () => {
    setIsCartLoading(true)
    await get('cart/all')
      .then((result) => {
        if (result.success) {
          dispatch(setTableData(result.carts))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsCartLoading(false))
  }
  useEffect(() => {
    if (state) {
      setNotes(state)
    }
    handleGetCart()
  }, []);
  if (tableData?.length === 0) {
    return (
      <>
        {(isCartLoading) && <SpinnerOverlay />}
        <div className="">
          <div className="rounded-lg border bg-white p-6 text-center">
            <h2 className="text-lg font-semibold">No Items in Quote</h2>
            <p className="mt-2 text-gray-600">
              Your quote is empty. Add some products to get started.
            </p>
            <Button
              onClick={() => push('/quick-quote')}
              className="mt-4"
            >
              Start New Quote
            </Button>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      {(isCartLoading) && <SpinnerOverlay />}
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submit Quote Request</h1>
          <p className="mt-2 text-gray-600">
            Please provide your contact information to submit your quote request
          </p>
        </div>
        {/* <div className="bg-white rounded-lg shadow-sm p-2">
          <nav className="flex gap-3 items-center flex-wrap">
            {rightSidetabs.map((tab, index) => (
              <div key={index}>
                <button
                  onClick={() => {
                    const currentParams = new URLSearchParams();
                    currentParams.set('q', tab?.path);
                    push(
                      {
                        pathname: location.pathname,
                        search: `?${currentParams.toString()}`,
                      },
                      { replace: true }
                    );
                  }}

                  className={`w-full flex items-center justify-between text-start px-4 py-3 rounded-md text-sm font-medium transition ${searchParams.get("q") === tab.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="h-4 w-4" />
                    <span className="line-clamp-1 text-sm">{tab.name}</span>
                  </div>
                </button>
              </div>
            ))}
          </nav>
        </div> */}
        <div className="mt-4">
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            activeKey={isActive}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            items={[
              {
                key: '1',
                label: 'Current Quick Quote',
                style: panelStyle,
                styles: {
                  header: { fontSize: '20px', fontWeight: '600', alignItems: 'center', textAlign: 'center' },
                },
                children: <>
                  {tableData?.length > 0 && <div className='pb-2  bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg'>
                    <Table>
                      <TableHeader>
                        <TableHead>Product Description</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Specifications</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Sub Total</TableHead>
                      </TableHeader>
                      {tableData.map((item, index) => (
                        <TableBody key={index}>
                          <TableRow>
                            <TableCell>{item?.alloyFamily}, {item?.productForm}, {item?.primaryDimension} {item?.lengthTolerance ? `±${item?.lengthTolerance}` : ""} <br />  {item?.identifier === 'Excess' ? <span className='text-danger'>Clearance  <br /> <Link href={'/customer/discounted-products'} className='text-danger underline' >View more Clearance items here</Link> </span> : ""} </TableCell>
                            <TableCell>{item?.grade} </TableCell>
                            <TableCell>{item?.specifications} </TableCell>
                            <TableCell>{item?.quantity} PCS
                              {/* {item?.uom === 'lb' ? 'lb.' : item?.uom === 'ft' ? 'ft.' : item?.uom === 'inch' && 'in.'} */}
                            </TableCell>
                            <TableCell>${Number(item?.prices?.price).toFixed(2)} </TableCell>
                            <TableCell>${(Number(item?.prices?.price) * Number(item?.quantity)).toFixed(2)} </TableCell>
                            <TableCell className="p-0" > <div className='flex' ><Button onClick={() => handleRemove(index, item)} variant='secondary' className='px-2 py-1 h-auto' ><X size={20} /></Button></div> </TableCell>
                          </TableRow>
                          {item?.cutLength && <TableRow className="p-0"> <TableCell colSpan={6} className="bg-white text-center py-1 rounded-md" > <FormFeedback className="p-0 m-0">Cutting costs are included in the above quote.  All pricing quoted subject to T.I. salesperson validation during order confirmation and contract review.</FormFeedback> </TableCell> </TableRow>}
                        </TableBody>))}
                    </Table>
                  </div>}
                  <form onSubmit={onSubmitQuote} >
                    <div className="flex items-start flex-wrap justify-between mt-3 md:gap-8 max-md:gap-3 bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg">
                      <div className="flex-grow min-w-80">
                        <Textarea
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Please provide any additional remarks, requests, or pertinent information."
                        />
                      </div>
                      <div className="flex flex-col gap-4 ms-auto">
                        <div className="grid grid-cols-2 gap-2 text-left text-xl font-bold">
                          <div>Quote Total:
                            <span className="text-base font-normal">
                              {userData?.discount ? ` (${userData?.discount}%)` : ''}
                            </span>
                          </div>
                          <div className="text-blue-600 ">${totalAmount.toFixed(2)}</div>
                          {isBelowMinimum && (
                            <p className="text-red-600 text-base font-medium mb-1">
                              Minimum order is $150
                            </p>
                          )}
                        </div>

                        <Button className='rounded-full' variant='outline' onClick={() => push('/quick-quote')} >Edit Quote</Button>
                        <button
                          type='submit'
                          disabled={!tableData?.length > 0 || isSubmitting || isBelowMinimum}
                          className={`px-8 py-2 text-base font-semibold rounded-full transition-colors
                          ${(!tableData?.length > 0 || isSubmitting || isBelowMinimum)
                              ? "bg-gray-400 cursor-not-allowed opacity-60"
                              : "bg-[#0A1F3C] text-white hover:bg-[#1B365D] cursor-pointer"
                            }
                        `}
                        >
                          Proceed To Billing & Shipping
                        </button>
                      </div>
                    </div>
                  </form>
                </>,
              },
              {
                key: '2',
                style: panelStyle,
                styles: {
                  header: { fontSize: '20px', fontWeight: '600', alignItems: 'center', textAlign: 'center' },
                },
                label: 'Billing & Shipping Address',
                children: <CheckoutAddress setIsActive={setIsActive} />,
              },
              {
                key: '3',
                style: panelStyle,
                styles: {
                  header: { fontSize: '20px', fontWeight: '600', alignItems: 'center', textAlign: 'center' },
                },
                label: 'Payment Information',
                children: <PaymentCard setIsActive={setIsActive} quoteData={quoteData} />,
              }
            ]}
          />
          {/* {!query ?
            <>
              {tableData?.length > 0 && <div className='pb-2  bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg'>
                <Table>
                  <TableHeader>
                    <TableHead>Product Description</TableHead>
                    <TableHead>Specifications</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Sub Total</TableHead>
                  </TableHeader>
                  {tableData.map((item, index) => (
                    <TableBody key={index}>
                      <TableRow>
                        <TableCell>{item?.alloyFamily}, {item?.productForm}, {item?.primaryDimension} {item?.lengthTolerance ? `±${item?.lengthTolerance}` : ""} <br />  {item?.identifier === 'Excess' ? <span className='text-danger'>Clearance  <br /> <Link href={'/customer/discounted-products'} className='text-danger underline' >View more Clearance items here</Link> </span> : ""} </TableCell>
                        <TableCell>{item?.specifications} </TableCell>
                        <TableCell>{item?.quantity} {item?.uom} </TableCell>
                        <TableCell>${Number(item?.prices?.price).toFixed(2)} </TableCell>
                        <TableCell>${(Number(item?.prices?.price) * Number(item?.quantity)).toFixed(2)} </TableCell>
                        <TableCell className="p-0" > <div className='flex' ><Button onClick={() => handleRemove(index, item)} variant='secondary' className='px-2 py-1 h-auto' ><X size={20} /></Button></div> </TableCell>
                      </TableRow>
                    </TableBody>))}
                </Table>
              </div>}
              <form onSubmit={onSubmitQuote} >
                <div className="flex items-start flex-wrap justify-between mt-3 md:gap-8 max-md:gap-3 bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg">
                  <div className="flex-grow min-w-80">
                    <Textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Please provide any additional remarks, requests, or pertinent information."
                    />
                  </div>
                  <div className="flex flex-col gap-4 ms-auto">
                    <div className="grid grid-cols-2 gap-2 text-left text-xl font-bold">
                      <div>Subtotal:
                        <span className="text-base font-normal">
                          {userData?.discount ? ` (${userData?.discount}%)` : ''}
                        </span>
                      </div>
                      <div className="text-blue-600 ">${totalAmount.toFixed(2)}</div>

                      <div>Tax: </div>
                      <div className="text-blue-600">${taxAmount?.toFixed(2) || '0.00'}</div>

                      <div>Quote Total: </div>
                      <div className="text-blue-600">${(taxAmount + totalAmount)?.toFixed(2)}</div>
                    </div>

                    <Button className='rounded-full' variant='outline' onClick={() => push('/quick-quote')} >Edit Quote</Button>
                    <button
                      type='submit'
                      disabled={!tableData?.length > 0 || isSubmitting}
                      className="px-8 py-2 bg-[#0A1F3C] text-white text-base font-semibold rounded-full hover:bg-[#1B365D] transition-colors"
                    >
                      Proceed To Billing & Shipping
                    </button>
                  </div>
                </div>
              </form>
            </> :
            <CheckoutAddress />} */}
        </div>
      </div >
    </>
  );
}