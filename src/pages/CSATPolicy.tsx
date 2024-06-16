import PageHeader from "../components/shared/PageHeader";
import { useAppSelector } from "../hooks";

export default function CSATPolicy() {
  // react - redux
  const policyPdfUrl = useAppSelector((state) => state.inventory.policyPdfUrl);

  return (
    <div className="">
      <PageHeader title="CSAT Policy" />
      <div className="h-[90vh]">
        <iframe src={policyPdfUrl} width={"100%"} height={"100%"}></iframe>
      </div>
    </div>
  );
}
