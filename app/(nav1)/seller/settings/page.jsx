export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Notifications</label>
                  <p className="text-xs text-muted-foreground">Receive notifications about orders and messages</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Profile Visibility</label>
                  <p className="text-xs text-muted-foreground">Control who can see your profile</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Show Online Status</label>
                  <p className="text-xs text-muted-foreground">Let others see when you're online</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data Sharing</label>
                  <p className="text-xs text-muted-foreground">Control how your data is used</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Two-Factor Authentication</label>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <p className="text-xs text-muted-foreground">Change your account password</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <p className="text-xs text-muted-foreground">Choose your preferred language</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
