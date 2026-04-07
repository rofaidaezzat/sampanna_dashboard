import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: string;
}

export function ContactUs() {
  const [messages] = useState<Message[]>([
    {
      id: "MSG-001",
      name: "Alice Johnson",
      email: "alice@example.com",
      subject: "Product Inquiry",
      message: "I would like to know more about the Laptop Pro specifications.",
      date: "2026-04-07",
      status: "New",
    },
    {
      id: "MSG-002",
      name: "Bob Wilson",
      email: "bob@example.com",
      subject: "Order Issue",
      message: "My order ORD-123 hasn't arrived yet. Can you help?",
      date: "2026-04-06",
      status: "Pending",
    },
    {
      id: "MSG-003",
      name: "Carol Martinez",
      email: "carol@example.com",
      subject: "Return Request",
      message: "I would like to return the headphones I purchased last week.",
      date: "2026-04-05",
      status: "Resolved",
    },
    {
      id: "MSG-004",
      name: "David Lee",
      email: "david@example.com",
      subject: "Partnership Opportunity",
      message: "Interested in discussing a potential business partnership.",
      date: "2026-04-04",
      status: "New",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Contact Us</h1>
        <p className="text-gray-600">Manage customer inquiries and messages</p>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div
            className="p-3 rounded-lg inline-block mb-4"
            style={{ backgroundColor: "#fef200" }}
          >
            <Mail size={24} className="text-black" />
          </div>
          <h3 className="mb-2">Email</h3>
          <p className="text-gray-600 text-sm">support@dashboard.com</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div
            className="p-3 rounded-lg inline-block mb-4"
            style={{ backgroundColor: "#fef200" }}
          >
            <Phone size={24} className="text-black" />
          </div>
          <h3 className="mb-2">Phone</h3>
          <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div
            className="p-3 rounded-lg inline-block mb-4"
            style={{ backgroundColor: "#fef200" }}
          >
            <MapPin size={24} className="text-black" />
          </div>
          <h3 className="mb-2">Address</h3>
          <p className="text-gray-600 text-sm">123 Business St, City, State</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div
            className="p-3 rounded-lg inline-block mb-4"
            style={{ backgroundColor: "#fef200" }}
          >
            <Clock size={24} className="text-black" />
          </div>
          <h3 className="mb-2">Hours</h3>
          <p className="text-gray-600 text-sm">Mon-Fri: 9AM - 6PM</p>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl">Recent Messages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{message.id}</td>
                  <td className="px-6 py-4">{message.name}</td>
                  <td className="px-6 py-4">{message.email}</td>
                  <td className="px-6 py-4">{message.subject}</td>
                  <td className="px-6 py-4">{message.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        message.status
                      )}`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl mb-4">Message Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Message ID</p>
                <p>{selectedMessage.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">From</p>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p>{selectedMessage.date}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p>{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Subject</p>
                <p>{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Message</p>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                    selectedMessage.status
                  )}`}
                >
                  {selectedMessage.status}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 py-2 rounded-lg"
                style={{ backgroundColor: "#fef200", color: "#000" }}
              >
                Close
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
