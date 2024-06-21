import { useEffect, useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useAppSelector } from "../hooks";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Loader from "../components/shared/Loader";

export default function CSATPolicy() {
  // states
  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  // react - redux
  const policyPdfUrl = useAppSelector((state) => state.inventory.policyPdfUrl);

  useEffect(() => {
    if (policyPdfUrl) {
      (async () => {
        const res = await fetch(policyPdfUrl);
        const data = await res.blob();
        const objURL = URL.createObjectURL(data);
        setPdf(objURL);
        setLoading(false);
      })();
    }
  }, [policyPdfUrl]);

  return (
    <div className="">
      <PageHeader title="CSAT Policy" />

      {loading && <Loader dataLoading />}

      <div className="">
        {pdf && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={pdf} />
          </Worker>
        )}
      </div>
    </div>
  );
}
