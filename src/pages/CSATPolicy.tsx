import PageHeader from "../components/shared/PageHeader";
import pdf from "../assets/test.pdf";

export default function CSATPolicy() {
  return (
    <div className="">
      <PageHeader title="CSAT Policy" />
      <div className="h-[90vh]">
        <iframe src={pdf} width={"100%"} height={"100%"}></iframe>
      </div>
    </div>
  );
}
