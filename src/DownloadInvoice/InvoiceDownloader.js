import React, { useEffect, useState } from "react";
import serverUrl from "../GlobalVariable/serverUrl.json";
import "./invoicedownload.css";

const InvoiceDownloader = () => {
  const [fileDownloaded, setFileDownloaded] = useState(
    "Fetching file to Download ! "
  );

  const [downloadSucc, setDownloadSucc] = useState(true);

  // let pathName = serverUrl.path + "downLoadInvoice?invoicefile=";
  let pathName = serverUrl.localPath + "FetchPdfDownloadingFile?inv=";

  useEffect(() => {
    const fName = getFileName();

    pathName = pathName + fName +".pdf";

    console.log(pathName);
    console.log(fName);

    if (fName === null || fName === "") {
      setDownloadSucc(false);
      setFileDownloaded("url is wrong, please provide a valid link");
    } else {
      downloadPdfFile(fName);
    }
  }, []);

  const downloadPdfFile = (fName) => {
    fetch(pathName)
      .then((response) => {
        if (!response.ok) {
          throw new Error("request failed ! check your internet connection");
        }

        return response.blob();
      })
      .then((blob) => {
        console.log("blob : ", blob);
        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          console.log(url);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fName);
          document.body.appendChild(link);
          link.click();
          setDownloadSucc(true);
          setFileDownloaded("File Downloaded Successfully");
        } else {
          // alert("No File Found!")
          setFileDownloaded("No Such File Found !");
          setDownloadSucc(false);
        }
      })
      .catch((error) => {
        setFileDownloaded("Something went wrong, while connecting to server!");
        setDownloadSucc(false);
      });
  };

  const getFileName = () => {
    var url_string = window.location.href; // www.test.com?filename=test
    var url = new URL(url_string);
    const filename = url.searchParams.get("inv");
    console.log("filename is is is :: " + filename);
    return filename;
  };
  return (
    <div>
      <div className={downloadSucc ? "downloadsuccess" : "downloadfailed"}>
        <h6>{fileDownloaded}</h6>{" "}
      </div>
    </div>
  );
};

export default InvoiceDownloader;
