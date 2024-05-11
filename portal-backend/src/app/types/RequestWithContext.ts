import express from 'express';
import { JwtPayload } from '../../users/services/jwt-signing.services';

export interface RequestWithContext extends express.Request {
  context: {
    requestId: string;
    tokenPayload?: JwtPayload;
  };
}
