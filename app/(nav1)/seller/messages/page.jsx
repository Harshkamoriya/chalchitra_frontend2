export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">3 unread messages</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">New Order Inquiry</h3>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Hi, I'm interested in your logo design service...</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                New
              </span>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">Project Update</h3>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">The website development is progressing well...</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Read
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
