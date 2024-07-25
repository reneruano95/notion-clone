import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { WorkspaceSettings } from "./workspace-settings";
import { ProfileSettings } from "./profile-settings";

export const Settings = () => {
  // This component is a container for the ProfileSettings and WorkspaceSettings components.
  // TODO: Implement the Tabs component for Permissions settings .

  return (
    <>
      <Tabs defaultValue="profile" className="border-b border-muted">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspaces">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="workspaces">
          <WorkspaceSettings />
        </TabsContent>
      </Tabs>
    </>
  );
};
