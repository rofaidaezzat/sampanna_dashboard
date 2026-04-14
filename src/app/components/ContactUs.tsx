import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import {
  ContactMessage,
  useGetContactQuery,
} from "../../redux/services/crudcontact";

export function ContactUs() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { data: messages = [], isLoading, isError } = useGetContactQuery();

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
          <p className="text-gray-600 text-sm">evristclimber@gmail.com</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div
            className="p-3 rounded-lg inline-block mb-4"
            style={{ backgroundColor: "#fef200" }}
          >
            <Phone size={24} className="text-black" />
          </div>
          <h3 className="mb-2">Phone</h3>
          <p className="text-gray-600 text-sm">01111530022</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div
            className="p-3 rounded-lg inline-block mb-4"
            style={{ backgroundColor: "#fef200" }}
          >
            <MapPin size={24} className="text-black" />
          </div>
          <h3 className="mb-2">Address</h3>
          <p className="text-gray-600 text-sm">Ismailia (Online Store)</p>
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
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{message._id}</td>
                  <td className="px-6 py-4">{message.name}</td>
                  <td className="px-6 py-4">{message.email}</td>
                  <td className="px-6 py-4">{message.createdAt.slice(0, 10)}</td>
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
              {!isLoading && messages.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-6 text-gray-600">Loading messages...</div>}
        {isError && <div className="p-6 text-red-600">Failed to load messages.</div>}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-white/20" onClick={() => setSelectedMessage(null)} />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl mb-4">Message Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Message ID</p>
                <p>{selectedMessage._id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">From</p>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p>{selectedMessage.createdAt.slice(0, 10)}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p>{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Message</p>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedMessage.message}
                </p>
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
