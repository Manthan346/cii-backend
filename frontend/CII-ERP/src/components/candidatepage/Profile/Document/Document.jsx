// Document.jsx
import { useState } from "react";
import Icon from "../../shared/Icon/Icon";
import UploadModal from "./UploadModal";
import API from "../../../../../api/api";
import "./Document.css";

function getUrlFromResponse(data, uploadedField) {
  switch (uploadedField) {
    case "passport_size_photo":
      return data?.candidate_photo ?? data?.passport_size_photo ?? null;
    case "resume":
      return data?.candidate_resume ?? data?.resume ?? null;
    case "pan_card":
      return data?.candidate_pan_card ?? data?.pan_card ?? null;
    case "aadhar_card":
      return data?.candidate_aadhar_card ?? data?.aadhar_card ?? null;
    default:
      return null;
  }
}

function StatusBadge({ verified }) {
  if (verified) {
    return (
      <span className="document__badge document__badge--verified">
        Uploaded
      </span>
    );
  }
  return (
    <span className="document__badge document__badge--pending">
      Not-Verified
    </span>
  );
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Document({ documents, onDocumentsChange }) {
  const [activeDoc, setActiveDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const closeModal = () => {
    setActiveDoc(null);
    setUploadError(null);
  };

  const applyResponseToDocuments = (data, uploadedField) => {
    const url = getUrlFromResponse(data, uploadedField);
    if (!url) return;

    onDocumentsChange((prevDocs) =>
      prevDocs.map((doc) =>
        doc.field === uploadedField
          ? {
              ...doc,
              status: "verified",
              uploadedOn: doc.uploadedOn || todayFormatted(),
              url,
            }
          : doc,
      ),
    );
  };

  const handleSingleUpload = async (file) => {
    if (!activeDoc?.field) {
      setUploadError("This document type is not supported for upload yet.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append(activeDoc.field, file, file.name);
      const res = await API.post("/candidate/candidate-documents", formData);
      applyResponseToDocuments(
        res.data?.data ?? res.data ?? {},
        activeDoc.field,
      );
      closeModal();
    } catch (err) {
      setUploadError(
        err?.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document">
      <div className="document__card">
        <div className="document__card-header">
          <span className="document__card-title">Uploaded Document</span>
        </div>

        <div className="document__list">
          {documents.map((doc) => {
            const isVerified = !!doc.url; // real check: only true once a file actually exists

            return (
              <div key={doc.id} className="document__item-wrap">
                <div className="document__item">
                  <div className="document__item-left">
                    <Icon
                      name={isVerified ? "document" : "alert"}
                      size={18}
                      color={isVerified ? "var(--ink-soft)" : "var(--orange)"}
                    />
                    <div>
                      <div className="document__item-name">{doc.name}</div>
                      {doc.uploadedOn && isVerified ? (
                        <div className="document__item-date">
                          Uploaded {doc.uploadedOn}
                        </div>
                      ) : (
                        <div className="document__item-date document__item-date--pending">
                          Not uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="document__item-right">
                    <StatusBadge verified={isVerified} />

                    <button
                      className="document__upload-btn"
                      onClick={() => setActiveDoc(doc)}
                    >
                      {isVerified ? "Re-upload" : "Upload Now"}
                    </button>

                    <a
                      className={`document__download-btn ${!isVerified ? "document__download-btn--disabled" : ""}`}
                      aria-label="Download"
                      href={doc.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        if (!isVerified) e.preventDefault();
                      }}
                    >
                      <Icon name="download" size={14} color="var(--ink-soft)" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="document__note">
          <span className="document__note-label">Note</span>
          <span className="document__note-text">
            File Size Should be less than 200KB (PDF Format only)
          </span>
        </div>
      </div>

      <UploadModal
        open={!!activeDoc}
        onClose={closeModal}
        onUpload={handleSingleUpload}
        uploading={uploading}
        error={uploadError}
      />
    </div>
  );
}
