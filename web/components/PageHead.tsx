import Head from "next/head";
import { FC } from "react";

const PageHead: FC<{ title?: string }> = ({ title }) => {
  return (
    <Head>
      <title>{title && `${title} |`} Tor Hosting</title>
    </Head>
  );
};

export default PageHead;
