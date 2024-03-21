import { Center, Link } from "@chakra-ui/react";
import { type FC } from "react";
import { BaseCard2 } from "../card/Base";

export const DownloadTemplateXlsxButton: FC = () => {
  return (
    <Link href="/static/surume.xlsx" download={true}>
      <BaseCard2>
        <Center>Download Template</Center>
      </BaseCard2>
    </Link>
  );
};
