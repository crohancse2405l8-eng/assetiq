import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { assetiqApi } from '../api/assetiqApi';

const reportFields = [
  { name: 'symptom', label: 'Symptom', rows: 3, placeholder: 'What did the operator or customer observe?' },
  { name: 'diagnosis', label: 'Diagnosis', rows: 3, placeholder: 'What was found during inspection?' },
  { name: 'action', label: 'Action', rows: 3, placeholder: 'Describe the work completed.' },
  { name: 'partsUsed', label: 'Parts used', rows: 2, placeholder: 'List parts, materials, or consumables.' },
  { name: 'outcome', label: 'Outcome', rows: 3, placeholder: 'Record the verified condition after service.' },
  { name: 'technicianNotes', label: 'Technician notes', rows: 3, placeholder: 'Add readings, observations, or follow-up details.' },
];

export default function ServiceReportPage() {
  const { assetId } = useParams();
  return <ServiceReportForm key={assetId} assetId={assetId} />;
}

function ServiceReportForm({ assetId }) {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    assetId: assetId || '',
    symptom: '',
    diagnosis: '',
    action: '',
    partsUsed: '',
    outcome: '',
    technicianNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const submissionLocked = useRef(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setReport((current) => ({ ...current, [name]: value }));
    setValidationError('');
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submissionLocked.current) return;

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      assetId,
      symptom: report.symptom.trim(),
      diagnosis: report.diagnosis.trim(),
      action: report.action.trim(),
      partsUsed: report.partsUsed.trim(),
      outcome: report.outcome.trim(),
      technicianNotes: report.technicianNotes.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      setValidationError('Complete every field before submitting the service report.');
      return;
    }

    submissionLocked.current = true;
    setIsSubmitting(true);
    setValidationError('');
    setApiError('');

    try {
      await assetiqApi.createMaintenanceReport(payload);
      setReport(payload);
      setSubmitted(true);
      navigate(`/assets/${assetId}`, {
        replace: true,
        state: { reportSubmitted: true },
      });
    } catch (error) {
      setApiError(error.message || 'The service report could not be submitted. Please try again.');
      submissionLocked.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-kicker">Field record / {assetId}</p>
          <h1>Service report</h1>
          <p className="page-intro">Capture what happened, what changed, and what the next technician should know.</p>
        </div>
        {submitted && <span className="badge success">Submitted</span>}
      </header>

      <article className="panel report-panel">
        {submitted ? (
          <div className="report-success" role="status">
            <span className="success-mark" aria-hidden="true">✓</span>
            <p className="section-kicker">Record saved</p>
            <h2>Service report submitted</h2>
            <p>The report for {report.assetId} was saved successfully.</p>
            <Link to={`/assets/${report.assetId}`} className="action-button">
              Return to Asset Detail
            </Link>
          </div>
        ) : (
          <form className="report-form" onSubmit={handleSubmit} noValidate>
            <div className="report-form-heading">
              <div>
                <p className="section-kicker">Service record</p>
                <h2>Work performed</h2>
              </div>
              <div className="report-asset-field">
                <label htmlFor="assetId">Asset ID</label>
                <input id="assetId" name="assetId" value={report.assetId} readOnly required />
              </div>
            </div>

            <div className="report-form-grid">
              {reportFields.map(({ name, label, rows, placeholder }) => (
                <div className="report-field" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <textarea
                    id={name}
                    name={name}
                    rows={rows}
                    value={report[name]}
                    onChange={updateField}
                    placeholder={placeholder}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>

            {validationError && <p className="form-message error-state" role="alert">{validationError}</p>}
            {apiError && <p className="form-message error-state" role="alert">{apiError}</p>}

            <button className="action-button report-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting report...' : 'Submit service report'}
            </button>
          </form>
        )}
      </article>
    </>
  );
}
