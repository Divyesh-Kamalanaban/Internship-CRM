import axios from '../utils/axios';

// Estimate API calls
export const estimateService = {
  getAllEstimates: () => axios.get('/estimate'),
  getEstimate: (id) => axios.get(`/estimate/${id}`),
  createEstimate: (data) => axios.post('/estimate', data),
  updateEstimate: (id, data) => axios.patch(`/estimate/${id}`, data),
  deleteEstimate: (id) => axios.delete(`/estimate/${id}`)
};

// Credit Note API calls
export const creditNoteService = {
  getAllCreditNotes: () => axios.get('/credit-note'),
  getCreditNote: (id) => axios.get(`/credit-note/${id}`),
  createCreditNote: (data) => axios.post('/credit-note', data),
  updateCreditNote: (id, data) => axios.patch(`/credit-note/${id}`, data),
  deleteCreditNote: (id) => axios.delete(`/credit-note/${id}`)
};

// Payment API calls
export const paymentService = {
  getAllPayments: () => axios.get('/payment'),
  getPayment: (id) => axios.get(`/payment/${id}`),
  createPayment: (data) => axios.post('/payment', data),
  updatePayment: (id, data) => {
    console.log('Updating payment with ID:', id);
    console.log('Update data:', data);
    return axios.patch(`/payment/${id}`, data);
  },
  deletePayment: (id) => axios.delete(`/payment/${id}`),
  getPaymentPDF: (id) => axios.get(`/payment/${id}/pdf`, { responseType: 'blob' })
};