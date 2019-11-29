import { AxiosStatic } from 'axios';
import { HttpDopplerApiClient } from './doppler-api-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

const consoleError = console.error;

function createHttpDopplerApiClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken: 'jwtToken',
      userData: { user: { email: 'email@mail.com' } } as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;
  const apiClient = new HttpDopplerApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should set get subscriber amount from list correctly', async () => {
    // Arrange
    const listExist = {
      data: {
        listId: 27311899,
        name: 'Shopify Contacto',
        currentStatus: 'ready',
        subscribersCount: 3,
        creationDate: '2019-05-30T11:47:45.367Z',
      },
      status: 200,
    };
    const request = jest.fn(async () => listExist);
    const dopplerApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerApiClient.getListData(27311899);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.amountSubscribers).not.toBe(undefined);
  });

  it('should set throw error when list does not exist', async () => {
    // Arrange
    const listNotExist = {
      data: {},
      status: 400,
      statusText: 'Error',
    };
    const request = jest.fn(async () => listNotExist);
    const dopplerApiClient = createHttpDopplerApiClient({ request });

    // Act
    const result = await dopplerApiClient.getListData(27311899);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  describe('GetSubscriber', () => {
    it('should get and error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(false);
    });

    it('should get a subscriber', async () => {
      // Arrange
      const subscriber = {
        data: {
          email: 'test@test.com',
          fields: [
            {
              name: 'test',
              value: 'test',
              predefined: true,
              private: true,
              readonly: true,
              type: 'boolean',
            },
          ],
          unsubscribedDate: '2019-11-27T18:05:40.847Z',
          unsubscriptionType: 'hardBounce',
          manualUnsubscriptionReason: 'administrative',
          unsubscriptionComment: 'test',
          status: 'active',
          score: 0,
        },
        status: 200,
      };
      const request = jest.fn(async () => subscriber);
      const dopplerApiClient = createHttpDopplerApiClient({ request });

      // Act
      const result = await dopplerApiClient.getSubscriber('test@test.com');

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(result).not.toBe(undefined);
      expect(result.success).toBe(true);
      expect(result.value.email).toEqual('test@test.com');
    });
  });
});
