// At the top of the file - outside the function
const countries = require('../../../../shared/data/countries.json');

export function generateTripHTML(trip: any) {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const diff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const getVisaStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      visa_required: 'Visa Required',
      visa_free: 'Visa Free',
      visa_on_arrival: 'Visa on Arrival',
      e_visa: 'eVisa Available',
      domestic: 'Domestic Travel',
    };
    return labels[status] || status;
  };

  // Helper function to get country name
  const getCountryName = (countryCode: string) => {
    const country = countries.find((c: any) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
          background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #eef2ff 100%);
          padding: 40px 20px;
          color: #1f2937;
          line-height: 1.6;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        /* Header Section */
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 40px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .brand-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .trip-title {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
          letter-spacing: -1px;
        }

        .trip-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          font-size: 15px;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meta-icon {
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        /* Summary Cards */
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          padding: 30px 40px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .summary-card-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .summary-card-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .summary-card-suffix {
          font-size: 16px;
          color: #6b7280;
          font-weight: 400;
        }

        /* Table Section */
        .content {
          padding: 40px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        thead {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        th {
          text-align: left;
          padding: 16px;
          font-size: 13px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        tbody tr {
          background: white;
          transition: background-color 0.2s;
        }

        tbody tr:nth-child(even) {
          background: #f9fafb;
        }

        tbody tr:hover {
          background: #f0f9ff;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #374151;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .country-cell {
          font-weight: 600;
          color: #111827;
        }

        .country-code {
          display: block;
          font-size: 11px;
          color: #6b7280;
          font-weight: 400;
          margin-top: 2px;
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .visa_required {
          background: #fee2e2;
          color: #991b1b;
        }

        .visa_required::before {
          background: #dc2626;
        }

        .visa_free {
          background: #dcfce7;
          color: #166534;
        }

        .visa_free::before {
          background: #16a34a;
        }

        .visa_on_arrival {
          background: #dbeafe;
          color: #1e40af;
        }

        .visa_on_arrival::before {
          background: #3b82f6;
        }

        .e_visa {
          background: #ede9fe;
          color: #6d28d9;
        }

        .e_visa::before {
          background: #8b5cf6;
        }

        .domestic {
          background: #f3f4f6;
          color: #374151;
        }

        .domestic::before {
          background: #6b7280;
        }

        .reg-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .reg-required {
          background: #fef3c7;
          color: #92400e;
        }

        .reg-not-required {
          background: #f3f4f6;
          color: #6b7280;
        }

        /* Info Section */
        .info-section {
          margin-top: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }

        .info-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-list {
          list-style: none;
          padding: 0;
        }

        .info-list li {
          font-size: 12px;
          color: #1e40af;
          padding: 6px 0;
          padding-left: 20px;
          position: relative;
        }

        .info-list li::before {
          content: '•';
          position: absolute;
          left: 8px;
          font-weight: 700;
        }

        /* Footer */
        .footer {
          padding: 30px 40px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .footer-content {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.8;
        }

        .footer-logo {
          font-weight: 700;
          color: #3b82f6;
        }

        .generated-date {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 8px;
        }

        /* Print Styles */
        @media print {
          body {
            background: white;
            padding: 0;
          }

          .container {
            box-shadow: none;
            border-radius: 0;
          }

          tbody tr:hover {
            background: inherit !important;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: 30px 20px;
          }

          .trip-title {
            font-size: 28px;
          }

          .content {
            padding: 20px;
          }

          .summary {
            padding: 20px;
          }

          table {
            font-size: 12px;
          }

          th, td {
            padding: 12px 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Header -->
        <div class="header">
          <div class="brand">
            <div class="brand-icon">✈️</div>
            <div class="brand-text">Visa Planner</div>
          </div>
          
          <h1 class="trip-title">${trip.name}</h1>
          
          <div class="trip-meta">
            <div class="meta-item">
              <div class="meta-icon">📅</div>
              <span>${formatDate(start)} - ${formatDate(end)}</span>
            </div>
            <div class="meta-item">
              <div class="meta-icon">⏱️</div>
              <span>${diff} day${diff !== 1 ? 's' : ''}</span>
            </div>
            <div class="meta-item">
              <div class="meta-icon">📍</div>
              <span>${trip.destinations.length} destination${trip.destinations.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary">
          <div class="summary-card">
            <div class="summary-card-label">Duration</div>
            <div class="summary-card-value">
              ${diff}<span class="summary-card-suffix"> days</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-card-label">Destinations</div>
            <div class="summary-card-value">
              ${trip.destinations.length}<span class="summary-card-suffix"> countries</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-card-label">Visa Required</div>
            <div class="summary-card-value">
              ${trip.destinations.filter((d: any) => d.visa_status === 'visa_required').length}<span class="summary-card-suffix"> of ${trip.destinations.length}</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="section-title">
            <div class="section-icon">🌍</div>
            Destinations & Visa Requirements
          </div>

          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Visa Status</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Registration</th>
              </tr>
            </thead>
            <tbody>
              ${trip.destinations
                .map(
                  (d: any) => `
                  <tr>
                    <td>
                      <div class="country-cell">
                        ${getCountryName(d.country_code)}
                        <span class="country-code">${d.country_code}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge ${d.visa_status || 'domestic'}">
                        ${getVisaStatusLabel(d.visa_status || 'domestic')}
                      </span>
                    </td>
                    <td>${d.visa_category?.replace(/_/g, ' ') || '-'}</td>
                    <td>${d.visa_duration || '-'}</td>
                    <td>
                      <span class="reg-badge ${d.mandatory_reg ? 'reg-required' : 'reg-not-required'}">
                        ${d.mandatory_reg ? 'Required' : 'Not Required'}
                      </span>
                    </td>
                  </tr>
                `,
                )
                .join('')}
            </tbody>
          </table>

          <!-- Important Information -->
          <div class="info-section">
            <div class="info-title">
              ⚠️ Important Travel Information
            </div>
            <ul class="info-list">
              <li>Visa requirements may change without notice. Always verify with official embassy sources before travel.</li>
              <li>Many countries require passport validity of at least 6 months beyond your planned departure date.</li>
              <li>Additional documents (proof of funds, return tickets, hotel bookings) may be required.</li>
              <li>Visa processing times vary by country and application type. Apply well in advance.</li>
              <li>Some countries require mandatory registration within a specified timeframe after arrival.</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-content">
            <div><span class="footer-logo">Visa Planner</span> • Travel with Confidence</div>
            <div class="generated-date">Generated on ${formatDate(new Date())} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

      </div>
    </body>
  </html>
  `;
}
