"use client"
import { useEffect, useState } from 'react';
import InvoiceDetailModal from './InvoiceDetailModal';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch('/api/invoice');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        const sortedInvoices = data.invoices.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)); // Sort invoices by invoice date in descending order
        setInvoices(sortedInvoices);
        setFilteredInvoices(sortedInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    }

    fetchInvoices();
  }, []);

  const handlePrint = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = invoices.filter((invoice) => {
      return (
        invoice.invoiceId.toLowerCase().includes(query) ||
        invoice.customer.name.toLowerCase().includes(query) ||
        invoice.customer.phone.includes(query) ||
        invoice.customer.email.toLowerCase().includes(query)
      );
    });
    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset current page when search query changes
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Invoice List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Invoice ID, Customer Name, Phone, or Email"
          className="border rounded px-5 py-2 border-slate-300 outline-none w-full max-w-[450px]"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-slate-200">
          <thead className="bg-primary-color">
            <tr>
              <th scope="col" className="border border-slate-700 px-2 w-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">No</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Invoice ID</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer Name</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Invoice Date</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Delivery Date</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Price</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Discounted</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Paid</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Due</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th scope="col" className="border border-slate-700 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((invoice, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{invoice.invoiceId}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{invoice.customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{formatDate(invoice.invoiceDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{formatDate(invoice.deliveryDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{invoice.total}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{invoice.discountedTotal}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{invoice.paidAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">{invoice.duePayment}</td>
                <td className={`px-6 py-4 whitespace-nowrap border border-slate-200 ${invoice.paymentStatus === 'unpaid' ? 'text-red-500' : 'text-primary-color'}`}>{invoice.paymentStatus === 'unpaid' ? invoice.paymentStatus : 'Paid'}</td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-200">
                  <button
                    className="bg-primary-color text-white px-3 p-1"
                    onClick={() => handlePrint(invoice)}
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav className="mt-4" aria-label="Pagination">
        <ul className="pagination flex flow-row justify-start items-center gap-3">
          {Array.from({ length: Math.ceil(filteredInvoices.length / itemsPerPage) }).map((_, index) => (
            <li key={index} className="page-item">
              <button
                onClick={() => paginate(index + 1)}
                className={`${
                  index + 1 === currentPage ? 'bg-primary-color text-white' : 'bg-white text-primary-color'
                } px-4 py-2 border border-gray-300 rounded hover:bg-primary-color hover:text-white`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {selectedInvoice && (
        <InvoiceDetailModal invoice={selectedInvoice} onClose={handleCloseModal} />
      )}
    </div>
  );
}


