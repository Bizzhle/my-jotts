import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../../../contexts/BetterAuthContext";
import { authClient } from "../../../libs/betterAuthClient";
import AutoCompleteElement from "../../../ui/AutoCompleteElement";
import ErrorAlert from "../../../ui/ErrorAlert";
import { Role, Roles } from "../roles";

interface RoleFormData {
  role: Role;
  userId: string;
}
export default function RoleForm() {
  const [value, setValue] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const { handleSubmit, reset } = useForm<RoleFormData>();

  async function storeError(error: string) {
    setError(error);
  }

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 10,
          offset: 0,
          sortBy: "name",
          sortDirection: "asc",
        },
      });
      if (error?.message) {
        await storeError(error.message);
      }
      setUsers(data?.users || []);
    }
    fetchUsers();
  }, []);

  const onSubmit = async () => {
    const userId = users.find((user) => user.email === email)?.id;
    if (!userId) {
      setError("Please select a valid user");
      return;
    }
    const { data, error } = await authClient.admin.setRole({
      userId: userId,
      role: value as Role,
    });
    if (error?.message) {
      await storeError(error.message);
    } else if (data) {
      setSuccess("Role assigned successfully");
      reset();
      setEmail("");
      setValue("");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        flexGrow: 1,
        border: "2px solid orange",
        p: { xs: 2, md: 2 },
      }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Typography variant="h6">Assign Roles</Typography>
      <ErrorAlert message={error} onDismiss={() => setError("")} />
      {success && (
        <Typography color="success.main">{success}</Typography>
      )}

      <AutoCompleteElement
        options={users.map((user) => user.email)}
        value={email}
        setValue={setEmail}
        label="User"
      />

      <AutoCompleteElement
        options={Roles}
        value={value}
        setValue={setValue}
        label="Role"
      />

      <Button
        variant="contained"
        size="medium"
        color="primary"
        fullWidth={true}
        type="submit"
        sx={{ textAlign: "center", mt: 1 }}
        disabled={!email || !value}
      >
        Submit
      </Button>
    </Box>
  );
}
