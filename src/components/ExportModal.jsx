import React from 'react';
import { X, FileSpreadsheet, FileJson, Download } from 'lucide-react';
import { exportTasksToCSV, exportTasksToJSON } from '../utils/storage';

export default function ExportModal({ isOpen, onClose, tasks = [], onShowToast }) {
  if (!isOpen) return null;

  function handleCSV() {
    exportTasksToCSV(tasks);
    if (onShowToast) onShowToast(`Successfully exported ${tasks.length} tasks as CSV.`, 'success');
    onClose();
  }

  function handleJSON() {
    exportTasksToJSON(tasks);
    if (onShowToast) onShowToast(`Successfully exported ${tasks.length} tasks as JSON.`, 'success');
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Export Workspace Tasks</h3>
            <p className="modal-subtitle">
              Choose your preferred format to export {tasks.length} tasks.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="export-options-grid">
          {/* Option 1: CSV */}
          <div className="export-option-card" onClick={handleCSV}>
            <div className="export-icon-box bg-emerald-subtle">
              <FileSpreadsheet size={28} className="text-emerald" />
            </div>
            <div className="export-card-text">
              <h4 className="export-option-title">Spreadsheet (CSV)</h4>
              <p className="export-option-desc">
                Comma-separated values format compatible with Microsoft Excel, Google Sheets, and Notion tables.
              </p>
              <div className="export-features-pill">
                <span>Includes 8 columns & timestamps</span>
              </div>
            </div>
            <button type="button" className="btn btn-secondary btn-export-action">
              <Download size={15} />
              <span>Download .csv</span>
            </button>
          </div>

          {/* Option 2: JSON */}
          <div className="export-option-card" onClick={handleJSON}>
            <div className="export-icon-box bg-blue-subtle">
              <FileJson size={28} className="text-blue" />
            </div>
            <div className="export-card-text">
              <h4 className="export-option-title">Structured Data (JSON)</h4>
              <p className="export-option-desc">
                Complete raw schema with IDs, user relations, descriptions, and ISO date strings.
              </p>
              <div className="export-features-pill">
                <span>Full JSON array format</span>
              </div>
            </div>
            <button type="button" className="btn btn-secondary btn-export-action">
              <Download size={15} />
              <span>Download .json</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
