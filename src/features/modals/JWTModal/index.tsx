import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Button, Textarea, Group } from "@mantine/core";
import { decode } from "jsonwebtoken";
import { event as gaEvent } from "nextjs-google-analytics";
import { useTranslation } from "../../../hooks/useTranslation";
import useFile from "../../../store/useFile";

export const JWTModal = ({ opened, onClose }: ModalProps) => {
  const setContents = useFile(state => state.setContents);
  const [token, setToken] = React.useState("");
  const { t } = useTranslation();

  const resolve = () => {
    if (!token) return;
    const json = decode(token);
    setContents({ contents: JSON.stringify(json, null, 2) });

    gaEvent("resolve_jwt");
    setToken("");
    onClose();
  };

  return (
    <Modal title={t("Decode JSON Web Token")} opened={opened} onClose={onClose} centered>
      <Textarea
        placeholder={t("JWT Example")}
        value={token}
        onChange={e => setToken(e.target.value)}
        autosize
        minRows={5}
        data-autofocus
      />
      <Group mt="xs" justify="right">
        <Button onClick={resolve} disabled={!token}>
          {t("Resolve")}
        </Button>
      </Group>
    </Modal>
  );
};
