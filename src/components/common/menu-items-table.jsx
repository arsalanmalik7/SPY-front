import { useState } from "react"
import Button from "./button"
import { Tooltip } from "@mui/material"
import { MenuService } from "../../services/MenuService"

// Update the table headers based on the active tab
export default function MenuItemsTable({ items, onEditItem, activeTab = "food", previousTable }) {
  const [selectedItems, setSelectedItems] = useState([])
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [restoreItem, setRestoreItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  // Function to format the date
  const formatDate = (dateString) => {

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(items.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (e, itemId) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const handleDelete = async (item) => {
    try {
      if (activeTab === "food") {
        await MenuService.deleteDish(item.uuid);
      } else {
        await MenuService.deleteWine(item.uuid);
      }
      // Refresh the items list after deletion
      window.location.reload();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete item. Please try again.');
    }

  };

  const handleRestore = async (item) => {
    console.log(item)
    if (item?.temperature) {
      try {
        await MenuService.restoreDish(item?.uuid);
        setShowRestoreModal(false);
        window.location.reload();

      } catch (error) {
        console.error(error, "Error");
        setShowRestoreModal(false);
      }
    } else {
      try {
        await MenuService.restoreWine(item?.uuid);
        setShowRestoreModal(false);
        window.location.reload();

      } catch (error) {
        console.error(error, "Error");
        setShowRestoreModal(false);
      }
    }
  };

  const userRole = localStorage.getItem("userRole");

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr className="bg-trbackground">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                onChange={handleSelectAll}
                checked={selectedItems.length === items.length && items.length > 0}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Image</th>
            {activeTab === "food" ? (
              <>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Dish Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Health Restrictions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Belief Accommodations
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Lifestyle Accommodations
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Price
                </th>
              </>
            ) : (
              <>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Wine Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Producer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Style Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Vintage
                </th>
              </>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>

            {userRole !== "employee" && <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id || item._id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  onChange={(e) => handleSelectItem(e, item.id || item._id)}
                  checked={selectedItems.includes(item.id || item._id)}
                />
              </td>
              <td className="px-4 py-4">
                <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden flex justify-center items-center">
                  {item.image_url ? <img
                    src={item.image_url.startsWith('https')
                      ? item.image_url
                      : `${process.env.REACT_APP_IMAGE_BASE_URL}${item.image_url}`}
                    alt={item.name || "Image"}
                    className="h-full w-full object-cover"
                  />
                    : <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>}
                </div>
              </td>
              {activeTab === "food" ? (
                <>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 text-left">{item.name || "-"}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-center">{item.typeDisplay || "-"}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-center">
                      {item.restaurantNameDisplay || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-center">
                      {Array.isArray(item?.dietary_restrictions?.health) && item.dietary_restrictions.health.length
                        ? item.dietary_restrictions.health.join(", ")
                        : "-"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-center">
                      {Array.isArray(item?.dietary_restrictions?.belief) && item.dietary_restrictions.belief.length
                        ? item.dietary_restrictions.belief.join(", ")
                        : "-"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-center">
                      {Array.isArray(item?.dietary_restrictions?.lifestyle) && item.dietary_restrictions.lifestyle.length
                        ? item.dietary_restrictions.lifestyle.join(", ")
                        : "-"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-center">{formatDate(item?.updatedAt)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 text-center">${item.price?.toFixed(2)}</div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 text-left">{item.product_name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-left">{item.producerDisplay}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-left">{item.category}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-left">{item.restaurantname || "-"}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-left">{item.style?.name || '-'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 text-left">{item.vintageDisplay}</div>
                  </td>
                </>
              )}
              <td className="px-4 py-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {item.status ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </td>

              {!previousTable && userRole !== "employee" && <td className="px-4 py-4 text-sm text-gray-500">
                <div className="flex space-x-2">

                  <Tooltip
                    title="Edit Menu Item"
                    placement="top"
                  >
                    <button onClick={() => onEditItem(item)} className="text-gray-500 hover:text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Archive Menu Item"
                    placement="top"

                  >
                    <button
                      onClick={() => {
                        setDeleteItem(item);
                        setShowDeleteModal(true);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6M9 16l3 3m0 0l3-3m-3 3V4m5 4h4M4 8h4"
                        />
                      </svg>

                    </button>
                  </Tooltip>
                </div>
              </td>}
              {previousTable && <td className="px-2 py-2 text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  onClick={() => {
                    setRestoreItem(item);
                    setShowRestoreModal(true);
                  }}
                >
                  Undo
                </button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-white">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Displaying 1-{items.length} of {items.length} items
          </div>
          <div className="flex flex-wrap items-center space-x-2">
            <Button variant="secondary" size="sm" disabled={true}>
              Previous
            </Button>
            <Button variant="primary" size="sm" className="bg-primary text-white">
              1
            </Button>
            <Button variant="secondary" size="sm" disabled={true}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {showRestoreModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Restore Item</h2>
            <p className="mb-6">
              Do you want to restore this {restoreItem?.category ? 'wine' : 'dish'}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowRestoreModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  handleRestore(restoreItem);
                  setShowRestoreModal(false);
                }}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Archive Item</h2>
            <p className="mb-6">
              Are you sure you want to move this {deleteItem?.category ? 'wine' : 'dish'} to your previous menu?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  handleDelete(deleteItem);
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
