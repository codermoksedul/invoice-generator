"use client";
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";

function InvoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceId: '',
    invoiceDate: '',
    deliveryDate: '',
    company: {
      companyName: 'Bengaledge | Digital Agency',
      creatorName: '',
      brandEmail: 'contact@bengalege.net',
      brandPhone: '01518301895',
      brandAddress: 'Rangpur, Bangladesh',
    },
    customer: {
      company: '',
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    items: [{
      serialNo: 1,
      productTitle: '',
      productDescription: '',
      quantity: 1,
      unitPrice: ''
    }],
    discount: 0,
    total: 0,
    discountedTotal: 0,
    paymentMethod: '',
    paymentDetails: '',
    paymentStatus: 'unpaid',
    paidAmount: '',
    duePayment: 0
  });

  const [errors, setErrors] = useState({
    company: '',
    customer: '',
    items: ''
  });

  useEffect(() => {
    const generatedId = generateInvoiceId();
    const currentDate = getCurrentDate();
    setInvoiceData({
      ...invoiceData,
      invoiceId: generatedId,
      invoiceDate: currentDate
    });
    // Initialize Due Payment based on Discounted Total and Paid Amount
    updateDuePayment();
  }, []);

  useEffect(() => {
    // Update due payment whenever discount or paid amount changes
    updateDuePayment();
  }, [invoiceData.discount, invoiceData.paidAmount]);

  const generateInvoiceId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `#${result}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const date = today.toLocaleDateString();
    const time = today.toLocaleTimeString();
    return `${date} ${time}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedInvoiceData = { ...invoiceData, [name]: value };

    if (name === 'discount' || name === 'paidAmount') {
      updateDuePayment();
    }

    setInvoiceData(updatedInvoiceData);
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      company: {
        ...invoiceData.company,
        [name]: value
      }
    });
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      customer: {
        ...invoiceData.customer,
        [name]: value
      }
    });
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    items[index] = {
      ...items[index],
      [name]: value
    };
    setInvoiceData({
      ...invoiceData,
      items: items
    });
  
    // Update due payment whenever item price or paid amount changes
    if (name === 'unitPrice' || name === 'paidAmount') {
      updateDuePayment();
    }
  
    // Recalculate total price and discounted total whenever item quantity or unit price changes
    if (name === 'quantity' || name === 'unitPrice') {
      const totalPrice = calculateTotalPrice();
      const discountedTotal = calculateDiscountedTotal();
      setInvoiceData(prevState => ({
        ...prevState,
        total: totalPrice,
        discountedTotal: discountedTotal
      }));
    }
  };
  

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    invoiceData.items.forEach(item => {
      const quantity = parseFloat(item.quantity);
      const unitPrice = parseFloat(item.unitPrice);
      if (!isNaN(quantity) && !isNaN(unitPrice)) {
        totalPrice += quantity * unitPrice;
      }
    });
    return totalPrice.toFixed(2);
  };
  
  const calculateDiscountedTotal = () => {
    const totalPrice = parseFloat(calculateTotalPrice());
    const discount = parseFloat(invoiceData.discount);
    if (!isNaN(totalPrice) && !isNaN(discount)) {
      const discountedAmount = (totalPrice * discount) / 100;
      return (totalPrice - discountedAmount).toFixed(2);
    }
    return totalPrice;
  };  

  const updateDuePayment = () => {
    const discountedTotal = calculateDiscountedTotal();
    const duePayment = (parseFloat(discountedTotal) - invoiceData.paidAmount).toFixed(2);
    setInvoiceData(prevState => ({
      ...prevState,
      duePayment: duePayment
    }));
  };

  const handlePaymentMethodChange = (e) => {
    const paymentMethod = e.target.value;
    setInvoiceData({
      ...invoiceData,
      paymentMethod: paymentMethod,
      paymentDetails: ''
    });
  };

  const renderPaymentDetailsInput = () => {
    switch (invoiceData.paymentMethod) {
      case 'bkash':
        return (
          <input
            className='input'
            type='text'
            name='paymentDetails'
            value={invoiceData.paymentDetails}
            onChange={handleChange}
            placeholder='Bkash Number'
          />
        );
      case 'nagad':
        return (
          <input
            className='input'
            type='text'
            name='paymentDetails'
            value={invoiceData.paymentDetails}
            onChange={handleChange}
            placeholder='Nagad Number'
          />
        );
      case 'bankTransfer':
        return (
          <input
            className='input'
            type='text'
            name='paymentDetails'
            value={invoiceData.paymentDetails}
            onChange={handleChange}
            placeholder='Bank Account Number'
          />
        );
      default:
        return null;
    }
  };

  const addItem = () => {
    const lastItem = invoiceData.items[invoiceData.items.length - 1];
    if (!lastItem.productTitle || !lastItem.productDescription || !lastItem.quantity || !lastItem.unitPrice) {
      alert("Please fill up the previous item details before adding a new item.");
      return;
    }
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          serialNo: invoiceData.items.length + 1,
          productTitle: '',
          productDescription: '',
          quantity: '',
          unitPrice: ''
        }
      ]
    });
  };

  const removeItem = (index) => {
    if (index !== 0) {
      const items = [...invoiceData.items];
      items.splice(index, 1);
      setInvoiceData({
        ...invoiceData,
        items: items
      });
    } else {
      alert("Cannot delete the first item.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Check if any input field is empty
    const isEmpty = Object.values(invoiceData).some(value => value === '');
  
    if (isEmpty) {
      alert("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const total = calculateTotalPrice();
      const discountedTotal = calculateDiscountedTotal();
      
      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...invoiceData,
          total: total,
          discountedTotal: discountedTotal
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
  
      alert("Form submitted successfully");
      window.location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <>
      <div className='w-full relative min-h-screen flex flex-col justify-start items-center my-5 '>
        <div className='border border-slate-200 p-5 rounded-md max-w-[1200px]'>
          <h2 className='text-center font-medium text-2xl'>New Invoice Bengaledge</h2>
          <form onSubmit={handleSubmit} className='grid grid-cols-1'>
            {/* Company Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 mb-4">
              <div>
                <label>Invoice ID:</label>
                <input className='input' type="text" name="invoiceId" value={invoiceData.invoiceId} readOnly />
              </div>
              <div>
                <label>Invoice Date:</label>
                <input className='input' type="text" name="invoiceDate" value={invoiceData.invoiceDate} readOnly />
              </div>
              <div>
                <label>Delivery Date:</label>
                <input className='input' type="date" name="deliveryDate" value={invoiceData.deliveryDate} onChange={handleChange} />
              </div>
              
              <div className='w-full'>
                <div className='input_hide'>
                  <label>Company Name:</label>
                  <input className='input' type="text" name="companyName" value={invoiceData.company.companyName} onChange={handleCompanyChange} />
                  <div className='error'>{errors.company}</div>
                </div>
                <div>
                  <label>Creator Name:</label>
                  <select className='input !py-2.5' name="creatorName" value={invoiceData.company.creatorName} onChange={handleCompanyChange}>
                    <option value="">Select Creator</option>
                    <option value="Akibul Hasan Akash">Akibul Hasan Akash</option>
                    <option value="Zarif Islam">Zarif Islam</option>
                    <option value="Moksedul Islam">Moksedul Islam</option>
                    <option value="Mehedi Hasan">Mehedi Hasan</option>
                    <option value="Al Amin">Al Amin</option>
                  </select>
                  <div className='error'>{errors.company}</div>
                </div>
                <div className='input_hide'>
                  <label>Email:</label>
                  <input className='input' type="text" name="brandEmail" value={invoiceData.company.brandEmail} onChange={handleCompanyChange} />
                  <div className='error'>{errors.company}</div>
                </div>
                <div className='input_hide'>
                  <label>Phone:</label>
                  <input className='input' type="text" name="brandPhone" value={invoiceData.company.brandPhone} onChange={handleCompanyChange} />
                  <div className='error'>{errors.company}</div>
                </div>
                <div className='input_hide'>
                  <label>Address:</label>
                  <input className='input' type="text" name="brandAddress" value={invoiceData.company.brandAddress} onChange={handleCompanyChange} />
                  <div className='error'>{errors.company}</div>
                </div>
              </div>
            </div>
            {/* Customer Information */}
            <h2 className='text-2xl my-2 text-center font-medium'>Customer Information</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
              <div>
                <label>Company:</label>
                <input className='input' type="text" name="company" value={invoiceData.customer.company} onChange={handleCustomerChange} />
                <div className='error'>{errors.customer}</div>
              </div>
              <div>
                <label>Name:</label>
                <input className='input' type="text" name="name" value={invoiceData.customer.name} onChange={handleCustomerChange} />
                <div className='error'>{errors.customer}</div>
              </div>
              <div>
                <label>Phone:</label>
                <input className='input' type="text" name="phone" value={invoiceData.customer.phone} onChange={handleCustomerChange} />
                <div className='error'>{errors.customer}</div>
              </div>
              <div>
                <label>Email:</label>
                <input className='input' type="text" name="email" value={invoiceData.customer.email} onChange={handleCustomerChange} />
                <div className='error'>{errors.customer}</div>
              </div>
              <div>
                <label>Address:</label>
                <input className='input' type="text" name="address" value={invoiceData.customer.address} onChange={handleCustomerChange} />
                <div className='error'>{errors.customer}</div>
              </div>
            </div>
            {/* Invoice Items */}
            <h2 className='text-2xl text-center font-medium my-5 mt-10'>Invoice Items</h2>
            <div className="items_container">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border p-2 font-medium text-sm w-[50px]">No</th>
                    <th className="border p-2 font-medium text-sm">Title</th>
                    <th className="border p-2 font-medium text-sm">Description</th>
                    <th className="border p-2 font-medium text-sm w-[100px]">Quantity</th>
                    <th className="border p-2 font-medium text-sm w-[150px]">Price</th>
                    <th className="border p-2 font-medium text-sm w-[80px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border text-center">{item.serialNo}</td>
                      <td className="border"><input className='px-3 py-2 outline-none w-full' placeholder='Product Title' type="text" name="productTitle" value={item.productTitle} onChange={(e) => handleItemChange(e, index)} /></td>
                      <td className="border "><textarea placeholder="Product description" className='px-3 py-2 outline-none w-full max-h-[40px] min-h-[40px]' type="text" name="productDescription" value={item.productDescription} onChange={(e) => handleItemChange(e, index)} /></td>
                      <td className="border " style={{width: '80px'}}><input placeholder='Quantity' className='px-3 py-2 outline-none w-full' type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(e, index)} /></td>
                      <td className="border " style={{width: '80px'}}><input placeholder='Price' className='px-3 py-2 outline-none w-full' type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(e, index)} onFocus={updateDuePayment} /></td>
                      <td className="border">
                        {index === 0 ? <div className='text-slate-400 text-center flex flex-col justify-center items-center  text-2xl cursor-not-allowed'><RiDeleteBinLine /></div> : <div onClick={() => removeItem(index)} className='text-slate-400 hover:text-red-500 text-center flex flex-col justify-center items-center text-2xl cursor-pointer'><RiDeleteBinLine /></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='w-full flex justify-center items-center mt-4'>
              <button onClick={addItem} type="button" className="flex justify-center items-center border border-slate-300 py-1 px-3 rounded-md text-slate-300 hover:text-slate-500 hover:border-slate-500">
                Add Item
              </button>
            </div>
            {/* Discount and Total */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-5">
              <div className=''>
                <label>Discount:</label>
                <select className='input' name="discount" value={invoiceData.discount} onChange={handleChange}>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                </select>
                <div className='error'>{errors.items}</div>
              </div>
              <div className=''>
                <label>Total Price:</label>
                <input className='input' type="text" value={calculateTotalPrice()} readOnly />
              </div>
              <div className=''>
                <label>Discounted Total:</label>
                <input className='input' type="text" value={calculateDiscountedTotal()} readOnly />
              </div>
              {/* Payment Status */}
              <div className=''>
                <label>Payment Status:</label>
                <select className='input' name="paymentStatus" value={invoiceData.paymentStatus} onChange={handleChange}>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              {/* Paid Amount */}
              <div className=''>
              <label>Paid Amount:</label>
              <input className='input' type="number" name="paidAmount" value={invoiceData.paidAmount} onChange={handleChange} />
            </div>
              {/* Due Payment */}
              <div className=''>
                <label>Due Payment:</label>
                <input className='input' type="number" name="duePayment" value={invoiceData.duePayment} readOnly />
              </div>
            </div>
            {/* Payment Method */}
            <div className=''>
              <label>Payment Method:</label>
              <select className='input' name="paymentMethod" value={invoiceData.paymentMethod} onChange={handlePaymentMethodChange}>
                <option value="">Select Payment Method</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="bankTransfer">Bank Transfer</option>
              </select>
            </div>
            {/* Payment Details */}
            {invoiceData.paymentMethod && (
              <div className='mt-3'>
                <label htmlFor="">Payment Details</label>
                {renderPaymentDetailsInput()}
              </div>
            )}
            <div className='w-full flex justify-center items-center mt-8'>
              <button type="submit" className="border border-slate-300 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default InvoiceForm;