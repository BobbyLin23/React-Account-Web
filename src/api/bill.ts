import request from '@/utils/request';

export const getBill = (page: number, currentTime: string, type_id: number) => {
  return request.get(
    `/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
      type_id || 0
    }`
  );
};

export const getBillByDate = (month: string) => {
  return request.get(`/bill/data?date=${month}`);
};

export const getBillDetail = (id: string | (string | null)[] | null) => {
  return request.get(`/bill/detail?id=${id}`);
};
