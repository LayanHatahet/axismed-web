import { AdminHeader } from "@/components/admin/AdminHeader";
import { Users, Plus } from "lucide-react";

export default function AdminSpeakers() {
  return (
    <>
      <AdminHeader title="Speakers & Faculty" subtitle="Manage your faculty network" />
      <div className="p-6">
        <div className="glass glow-border rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">Faculty Network</h3>
          <p className="text-text-muted mb-6">Add and manage your speakers and instructors.</p>
          <button className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            <Plus className="w-4 h-4" /> Add Speaker
          </button>
        </div>
      </div>
    </>
  );
}
