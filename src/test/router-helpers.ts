import { testRouter } from './factories/test-router';
import { RouteStrategy } from '../router';
import { lastValueFrom, from } from 'rxjs';
import { RawEvent } from '../raw-event';

export const testRouting = async (messages: RawEvent[], strategy?: RouteStrategy) => {
  const router = testRouter();
  if (strategy) router.strategy = strategy;
  await lastValueFrom(router.route()(from(messages)));
};
