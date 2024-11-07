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

const useReport = ({
  page = 1,
  limit = 10,
  init = false
}: {
  page?: number;
  limit?: number;
  init?: boolean;
}) => {
  const [reports, setReports] = useState<{
    reports: ReportProps[];
    page: number;
    limit: number;
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAll = async (page: number, limit: number, q?: string | null) => {
    setLoading(true);
    const result = await axios.get(`/api/bff/reports`, {
      params: {
        page,
        limit,
        ...(q ? { q: q } : {})
      }
    });
    setLoading(false);
    if (result.data.reports) {
      setReports(result.data.reports);
    }
  };

  const create = async (payload: ReportProps) => {
    setLoading(true);
    const result = await axios.post('/api/bff/reports', payload);
    setLoading(false);
    return result.data;
  };

  const update = async (payload: ReportProps, report_id: string) => {
    setLoading(true);
    const result = await axios.put(`/api/bff/reports/${report_id}`, payload);
    setLoading(false);
    return result.data;
  };

  const deleteReport = async (report_id: string) => {
    setLoading(true);
    const result = await axios.delete(`/api/bff/reports/${report_id}`);
    setLoading(false);
    return result.data;
  };

  const getReportByDay = async () => {
    setLoading(true);
    const result = await axios.get(`/api/bff/reports/day`);
    setLoading(false);
    return result.data;
  };

  const getReportByMonth = async () => {
    setLoading(true);
    const result = await axios.get(`/api/bff/reports/month`);
    setLoading(false);
    return result.data;
  };

  useEffect(() => {
    if (!reports && !loading && init) {
      setTimeout(() => {
        getAll(page, limit);
      }, 300);
    }
  }, [init]);

  return {
    reports,
    getAll,
    loading,
    create,
    update,
    deleteReport,
    getReportByDay,
    getReportByMonth
  };
};

export default useReport;
