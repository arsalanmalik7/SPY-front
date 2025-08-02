import Button from "./button"

export default function SuccessModal({ onAddEmployees, onLater }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Restaurant Added</h2>
        <p className="text-gray-600 mb-6">
          Your restaurant has been added.
        </p>
        <div className="space-y-3">
          <Button variant="outline" onClick={onLater} className="w-full">
            Okay
          </Button>
        </div>
      </div>
    </div>
  )
}
