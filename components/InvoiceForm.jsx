"use client"
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";

function InvoiceForm() {
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
    paymentMethod: '',
    paymentDetails: ''
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
  }, []);

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
    setInvoiceData({
      ...invoiceData,
      [name]: value
    });
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

    try {
      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Reset form fields or show a success message
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <>
      <div className='w-full relative min-h-screen flex flex-col justify-start items-center my-5 '>
      <div className='border border-slate-200 p-5 rounded-md max-w-[1200px]'>
        <h2 className='text-center font-medium text-2xl'>New Invoice Bengaledge</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-1'>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 mb-4">
            {/* Invoice ID */}
            <div>
              <label>Invoice ID:</label>
              <input className='input' type="text" name="invoiceId" value={invoiceData.invoiceId} readOnly />
            </div>
            {/* Invoice Date */}
            <div>
              <label>Invoice Date:</label>
              <input className='input' type="text" name="invoiceDate" value={invoiceData.invoiceDate} readOnly />
            </div>
            {/* Delivery Date */}
            <div>
              <label>Delivery Date:</label>
              <input className='input' type="date" name="deliveryDate" value={invoiceData.deliveryDate} onChange={handleChange} />
            </div>
            {/* Company Information */}
          </div>
          {/* company info */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>
            <div className='input_hide'>
              <label>Company Name:</label>
              <input className='input' type="text" name="companyName" value={invoiceData.company.companyName} onChange={handleCompanyChange} />
              <div className='error'>{errors.company}</div>
            </div>
            <div>
              <label>Creator Name:</label>
              <select className='input' name="creatorName" value={invoiceData.company.creatorName} onChange={handleCompanyChange}>
                <option value="">Select Creator</option>
                <option value="Jane Doe">Akibul Hasan Akash</option>
                <option value="Jane Doe">Zarif Islam</option>
                <option value="John Doe">Moksedul Islam</option>
                <option value="Jane Doe">Mehedi Hasan</option>
                <option value="Jane Doe">Al Amin</option>
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
                    <td className="border " style={{width: '80px'}}><input placeholder='Price' className='px-3 py-2 outline-none w-full' type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(e, index)} /></td>
                    <td className="border">
                      {index === 0 ? <div className='text-slate-400 text-center flex flex-col justify-center items-center  text-2xl cursor-not-allowed'><RiDeleteBinLine /></div> : (
                        <button type="button" onClick={() => removeItem(index)} className='text-red-500 px-3 py-1 text-2xl'>
                          <RiDeleteBinLine />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className='bg-green-500 px-5 py-2 text-white block mt-4' onClick={addItem}>Add New Item</button>
            <div className='error'>{errors.items}</div>
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
          </div>

          {/* Payment Method */}
          <div className='my-5'>
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
            <div className='my-5'>
              <label>Payment Details:</label>
              {renderPaymentDetailsInput()}
            </div>
          )}
          {/* Submit Button */}
          <button type="submit" className='px-5 py-2 bg-green-500 text-white mt-5'>Submit</button>
        </form>
      </div>
      </div>
    </>
  );
}

export default InvoiceForm;

