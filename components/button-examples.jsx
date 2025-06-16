"use client"

import ResponsiveButton from "./responsive-button"
import { ArrowRight, Download, Heart, Star, Plus, Check, X, Settings } from "lucide-react"

export default function ButtonExamples() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Responsive Button Component</h1>

        {/* Variants */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Variants</h2>
          <div className="flex flex-wrap gap-4">
            <ResponsiveButton variant="primary">Primary</ResponsiveButton>
            <ResponsiveButton variant="secondary">Secondary</ResponsiveButton>
            <ResponsiveButton variant="success">Success</ResponsiveButton>
            <ResponsiveButton variant="danger">Danger</ResponsiveButton>
            <ResponsiveButton variant="warning">Warning</ResponsiveButton>
            <ResponsiveButton variant="outline">Outline</ResponsiveButton>
            <ResponsiveButton variant="ghost">Ghost</ResponsiveButton>
            <ResponsiveButton variant="gradient">Gradient</ResponsiveButton>
          </div>
        </section>

        {/* Sizes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <ResponsiveButton size="xs">Extra Small</ResponsiveButton>
            <ResponsiveButton size="sm">Small</ResponsiveButton>
            <ResponsiveButton size="md">Medium</ResponsiveButton>
            <ResponsiveButton size="lg">Large</ResponsiveButton>
            <ResponsiveButton size="xl">Extra Large</ResponsiveButton>
          </div>
        </section>

        {/* With Icons */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">With Icons</h2>
          <div className="flex flex-wrap gap-4">
            <ResponsiveButton icon={<Download size={16} />}>Download</ResponsiveButton>
            <ResponsiveButton variant="success" icon={<Check size={16} />} iconPosition="left">
              Approve
            </ResponsiveButton>
            <ResponsiveButton variant="danger" icon={<X size={16} />} iconPosition="right">
              Cancel
            </ResponsiveButton>
            <ResponsiveButton variant="gradient" icon={<Star size={16} />} rounded="full">
              Favorite
            </ResponsiveButton>
          </div>
        </section>

        {/* Loading States */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Loading States</h2>
          <div className="flex flex-wrap gap-4">
            <ResponsiveButton loading>Loading...</ResponsiveButton>
            <ResponsiveButton variant="success" loading>
              Processing
            </ResponsiveButton>
            <ResponsiveButton variant="outline" loading>
              Please wait
            </ResponsiveButton>
          </div>
        </section>

        {/* Rounded Variations */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rounded Variations</h2>
          <div className="flex flex-wrap gap-4">
            <ResponsiveButton rounded="none">No Radius</ResponsiveButton>
            <ResponsiveButton rounded="sm">Small</ResponsiveButton>
            <ResponsiveButton rounded="md">Medium</ResponsiveButton>
            <ResponsiveButton rounded="lg">Large</ResponsiveButton>
            <ResponsiveButton rounded="xl">Extra Large</ResponsiveButton>
            <ResponsiveButton rounded="full">Full</ResponsiveButton>
          </div>
        </section>

        {/* Full Width */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Full Width</h2>
          <div className="space-y-4">
            <ResponsiveButton fullWidth variant="primary">
              Full Width Primary
            </ResponsiveButton>
            <ResponsiveButton fullWidth variant="gradient" icon={<ArrowRight size={16} />} iconPosition="right">
              Get Started Now
            </ResponsiveButton>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResponsiveButton variant="primary" icon={<Plus size={16} />} onClick={() => alert("Add new item!")}>
              Add Item
            </ResponsiveButton>

            <ResponsiveButton
              variant="outline"
              icon={<Settings size={16} />}
              onClick={() => alert("Opening settings...")}
            >
              Settings
            </ResponsiveButton>

            <ResponsiveButton variant="danger" onClick={() => alert("Are you sure?")} shadow={false}>
              Delete
            </ResponsiveButton>

            <ResponsiveButton variant="success" icon={<Heart size={16} />} rounded="full" ripple={true}>
              Like
            </ResponsiveButton>

            <ResponsiveButton disabled variant="secondary">
              Disabled
            </ResponsiveButton>

            <ResponsiveButton variant="gradient" size="lg" className="font-bold">
              Custom Style
            </ResponsiveButton>
          </div>
        </section>
      </div>
    </div>
  )
}
