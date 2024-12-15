import axios from 'axios';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { ReportProps } from '@/types/Report';

export interface UseReportStateProps {
  selected: ReportProps | null;
  openDeleteDialog: boolean;
  openFormDialog: boolean;
  setOpenFormDialog: (value: boolean) => void;
  setOpenDeleteDialog: (value: boolean) => void;
  setSelected: (report: ReportProps | null) => void;
}

export const useReportState = create<UseReportStateProps>((set) => ({
  selected: null,
  openDeleteDialog: false,
  openFormDialog: false,
  setOpenFormDialog: (value: boolean) =>
    set((state) => ({ ...state, openFormDialog: value })),
  setOpenDeleteDialog: (value: boolean) =>
    set((state) => ({ ...state, openDeleteDialog: value })),
  setSelected: (report: ReportProps | null) =>
    set((state) => ({ ...state, selected: report }))
}));

const useReport = () => {
  const [reports, setReports] = useState<ReportProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getReportByDay = async (date?: Date | null) => {
    setLoading(true);
    const result = await axios.get(`/api/bff/reports/daily`, {
      params: {
        date: date?.toISOString() || new Date().toISOString()
      }
    });
    setLoading(false);
    if (result.data.report) {
      setReports(result.data.report);
    }
    return result.data.report;
  };

  const create = async (payload: any) => {
    setLoading(true);
    const result = await axios.post('/api/bff/reports', payload);
    setLoading(false);
    return result.data;
  };

  const update = async (payload: any, report_id: string) => {
    setLoading(true);
    const result = await axios.put(`/api/bff/reports/${report_id}`, payload);
    setLoading(false);
    return result.data;
  };

  const updateSales = async (payload: any) => {
    setLoading(true);
    const result = await axios.put(`/api/bff/reports/updatesales`, payload);
    setLoading(false);
    return result.data;
  };

  const deleteReport = async (report_id: string) => {
    setLoading(true);
    const result = await axios.delete(`/api/bff/reports/${report_id}`);
    setLoading(false);
    return result.data;
  };

  const createDailyReport = async () => {
    setLoading(true);
    const result = await axios.post('/api/bff/reports/daily');
    setLoading(false);
    return result.data;
  };

  const getReportByDateRange = async (startDate: Date, endDate: Date) => {
    setLoading(true);
    const result = await axios.get('/api/bff/reports/range', {
      params: { startDate, endDate }
    });
    setLoading(false);
    return result.data;
  };

  return {
    reports,
    loading,
    create,
    update,
    deleteReport,
    getReportByDay,
    createDailyReport,
    updateSales,
    getReportByDateRange
  };
};

export default useReport;
