// Clean completion rate indicator
export default function CompletionRate({ completion }) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-600">Completion Rate: {completion}%</span>
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completion}%` }}
        ></div>
      </div>
    </div>
  )
}
