"use client"
import { useEffect, useState } from 'react';

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
      quantity: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    let formIsValid = true;
    const newErrors = { ...errors };

    // Check for required fields
    if (!invoiceData.company.companyName || !invoiceData.company.creatorName || !invoiceData.company.brandEmail || !invoiceData.company.brandPhone || !invoiceData.company.brandAddress) {
      newErrors.company = 'All company fields are required';
      formIsValid = false;
    } else {
      newErrors.company = '';
    }

    if (!invoiceData.customer.company || !invoiceData.customer.name || !invoiceData.customer.phone || !invoiceData.customer.email || !invoiceData.customer.address) {
      newErrors.customer = 'All customer fields are required';
      formIsValid = false;
    } else {
      newErrors.customer = '';
    }

    // Check for at least one item
    if (invoiceData.items.length === 0 || !invoiceData.items.some(item => item.productTitle || item.productDescription || item.quantity || item.unitPrice)) {
      newErrors.items = 'At least one item is required';
      formIsValid = false;
    } else {
      newErrors.items = '';
    }

    // Set errors state
    setErrors(newErrors);

    // If form is valid, proceed with form submission
    if (formIsValid) {
      console.log("Form submitted successfully:", invoiceData);
      // Add code here to handle form submission (e.g., send data to server)
    } else {
      console.log("Form validation failed. Please check the errors.");
    }
  };

  return (
    <div className='w-full relative min-h-screen flex flex-col justify-start items-center'>
      <h2>Invoice Form</h2>
      <form onSubmit={handleSubmit} className='grid grid-cols-1 border border-slate-200 p-5 rounded-md'>
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div>
            <label>Company Name:</label>
            <input className='input' type="text" name="companyName" value={invoiceData.company.companyName} onChange={handleCompanyChange} />
            <div className='error'>{errors.company}</div>
          </div>
          <div>
            <label>Creator Name:</label>
            <select className='input' name="creatorName" value={invoiceData.company.creatorName} onChange={handleCompanyChange}>
              <option value="">Select Creator Name</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Doe">Jane Doe</option>
              {/* Add more options as needed */}
            </select>
            <div className='error'>{errors.company}</div>
          </div>
          <div>
            <label>Email:</label>
            <input className='input' type="text" name="brandEmail" value={invoiceData.company.brandEmail} onChange={handleCompanyChange} />
            <div className='error'>{errors.company}</div>
          </div>
          <div>
            <label>Phone:</label>
            <input className='input' type="text" name="brandPhone" value={invoiceData.company.brandPhone} onChange={handleCompanyChange} />
            <div className='error'>{errors.company}</div>
          </div>
          <div>
            <label>Address:</label>
            <input className='input' type="text" name="brandAddress" value={invoiceData.company.brandAddress} onChange={handleCompanyChange} />
            <div className='error'>{errors.company}</div>
          </div>
        </div>
        {/* Customer Information */}
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
        <h3 className='my-5'>Invoice Items:</h3>
        <div>
          <table className='table-auto'>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Product Title</th>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.serialNo}</td>
                  <td><input className='input' type="text" name="productTitle" value={item.productTitle} onChange={(e) => handleItemChange(e, index)} /></td>
                  <td><input className='input' type="text" name="productDescription" value={item.productDescription} onChange={(e) => handleItemChange(e, index)} /></td>
                  <td><input className='input' type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(e, index)} /></td>
                  <td><input className='input' type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(e, index)} /></td>
                  <td>{index === 0 ? '-' : <button type="button" onClick={() => removeItem(index)} className='bg-red-500 px-3 py-1 text-white'>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className='bg-green-500 px-5 py-1 text-white block mt-4' onClick={addItem}>Add New Item</button>
          <div className='error'>{errors.items}</div>
        </div>
        {/* Discount and Total */}
        <div className='my-5'>
          <label>Discount:</label>
          <input className='input' type="number" name="discount" value={invoiceData.discount} onChange={handleChange} />
          <div className='error'>{errors.items}</div>
        </div>
        <div className='my-5'>
          <label>Total Price:</label>
          <input className='input' type="text" value={calculateTotalPrice()} readOnly />
        </div>
        <div className='my-5'>
          <label>Discounted Total:</label>
          <input className='input' type="text" value={calculateDiscountedTotal()} readOnly />
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
  );
}

export default InvoiceForm;

