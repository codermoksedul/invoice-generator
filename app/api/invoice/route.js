import { connectMongoDB } from "@/lib/mongodb";
import Invoice from "@/models/invoice";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const invoiceData = await req.json();
    await connectMongoDB();
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    return NextResponse.json({ message: "Invoice inserted successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error inserting invoice:", error);
    return NextResponse.json({ message: "An error occurred while inserting the invoice." }, { status: 500 });
  }
}


// Function to handle GET requests
export async function GET(req) {
  try {
    await connectMongoDB();
    const invoices = await Invoice.find({});
    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ message: "An error occurred while fetching invoices." }, { status: 500 });
  }
}