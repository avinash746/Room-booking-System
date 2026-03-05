import { format, differenceInCalendarDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateInput = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calcNights = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  return differenceInCalendarDays(new Date(endDate), new Date(startDate));
};

export const getTodayString = () => {
  return formatDateInput(new Date());
};

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};