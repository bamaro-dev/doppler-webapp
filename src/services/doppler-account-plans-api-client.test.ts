import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { HttpDopplerAccountPlansApiClient } from './doppler-account-plans-api-client';
import { fakeAccountPlanDiscounts } from './doppler-account-plans-api-client.double';

const consoleError = console.error;
const jwtToken = 'jwtToken';
const accountEmail = 'email@mail.com';

function createHttpDopplerAccountPlansApiClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken,
      userData: { user: { email: accountEmail } } as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;

  const apiClient = new HttpDopplerAccountPlansApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerAccountPlansApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get discounts data', async () => {
    // Arrange
    const planDiscounts = {
      data: fakeAccountPlanDiscounts,
      status: 200,
    };
    const request = jest.fn(async () => planDiscounts);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getDiscountsData(1, 5);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getDiscountsData(1, 5);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });
});
