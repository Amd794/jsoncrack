import React from "react";
import { Modal, Paper, Image, Text, Divider, Button, Group, Box } from "@mantine/core";
import { useTranslation } from "../../../hooks/useTranslation";

interface WechatModalProps {
  opened: boolean;
  onClose: () => void;
}

export const WechatModal = ({ opened, onClose }: WechatModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("WeChat Official Account")}
      size="md"
      centered
    >
      <Paper p="lg" withBorder shadow="sm">
        <Group direction="column" align="center" gap="md">
          <Image
            src="/wechat_qrcode.webp"
            alt="WeChat QR Code"
            width={200}
            height={200}
            fit="contain"
          />
          <Text ta="center" fw="600" fz="lg">
            {t("Scan QR Code to Follow")}
          </Text>
          <Text ta="center" c="dimmed">
            {t("Get the latest updates and tips about JSON Crack")}
          </Text>
          <Divider my="md" />
          <Box ta="center">
            <Text fw="500">{t("Thank you for your support!")}</Text>
          </Box>
          <Button onClick={onClose} mt="md">
            {t("Close")}
          </Button>
        </Group>
      </Paper>
    </Modal>
  );
};
