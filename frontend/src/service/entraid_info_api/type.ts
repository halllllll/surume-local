import type { OperationResult } from '@/types/types';
import { initDBTargets } from '@/view/modal/init/type';

// dto
type EntraIdInfo = {
  clientid: string;
  authority: string;
  port: number;
  created: Date;
  updated: Date;
};

// 結果が複雑なのでOperationResultでは対応できない
export type GetEntraIdInfoResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      exist: false;
    }
  | {
      success: true;
      exist: true;
      data: EntraIdInfo;
    };

export type PostEntraIdInfoRequest = {
  clientid: string;
  authority: string;
  port: number;
};

type PostResult = 'UPDATE' | 'CREATE';

export type PostEntraIdInfoResponse = OperationResult<PostResult>;

export type InitRequest = {
  target: (typeof initDBTargets)[number][];
};
export { initDBTargets };
