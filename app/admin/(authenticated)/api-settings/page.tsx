import { checkAdminAccess } from "@/lib/check-admin";
import { getAllApiConfigs } from "@/lib/api-config";
import { ApiConfigManager } from "@/components/admin/api-config-manager";

export const metadata = {
  title: "API Settings",
  description: "Manage API configurations and integrations",
};

export default async function ApiSettingsPage() {
  await checkAdminAccess();

  const configs = await getAllApiConfigs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">API Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your API configurations, keys, and integrations
        </p>
      </div>

      <ApiConfigManager initialConfigs={configs} />
    </div>
  );
}
