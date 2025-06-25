export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">5 unread notifications</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">Order Completed</h3>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Your logo design order has been marked as completed</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Success
              </span>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">Payment Received</h3>
              <span className="text-xs text-muted-foreground">3 hours ago</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">You received $150 for your web development service</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Payment
              </span>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">New Review</h3>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">You received a 5-star review for your recent work</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
