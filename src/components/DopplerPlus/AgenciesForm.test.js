import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AgenciesForm from './AgenciesForm';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { act } from 'react-dom/test-utils';

describe('AgenciesForm component', () => {
  const dependencies = {
    appSessionRef: {
      current: {
        userData: {
          user: {
            email: 'hardcoded@email.com',
          },
        },
      },
    },
    dopplerLegacyClient: {
      requestAgenciesDemo: async () => {
        return { success: true };
      },
    },
    captchaUtilsService: {
      useCaptcha: () => {
        const Captcha = () => null;
        const verifyCaptcha = async () => {
          return { success: true, captchaResponseToken: 'hardcodedResponseToken' };
        };
        const recaptchaRef = null;
        return [Captcha, verifyCaptcha, recaptchaRef];
      },
    },
  };

  const AgenciesFormElement = () => (
    <AppServicesProvider forcedServices={dependencies}>
      <DopplerIntlProvider>
        <AgenciesForm />
      </DopplerIntlProvider>
    </AppServicesProvider>
  );
  jest.useFakeTimers();

  it('should show success message if submit succesfully', async () => {
    // Arrange
    const { container, getByText } = render(<AgenciesFormElement />);

    // Act
    act(() => {
      const inputName = container.querySelector('input#name');
      fireEvent.change(inputName, { target: { value: 'Juan' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Perez' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => {
      return expect(getByText('agencies.success_msg')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'agencies.submitted' })).toHaveAttribute(
      'href',
      'common.homeUrl',
    );
    expect(screen.getByRole('link', { name: 'common.breadcrumb_plans' })).toHaveAttribute(
      'href',
      'common.breadcrumb_plans_url',
    );
  });

  it('should show messages for empty required fields', async () => {
    // Arrange
    const { container, getAllByText } = render(<AgenciesFormElement />);

    // Act
    act(() => {
      const inputEmail = container.querySelector('input#email');
      fireEvent.change(inputEmail, { target: { value: '' } });

      const inputName = container.querySelector('input#name');
      fireEvent.change(inputName, { target: { value: '' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: '' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getAllByText('validation_messages.error_required_field').length).toBe(4);
  });

  it('should show error message if email field is empty', async () => {
    // Arrange
    const { container, getByText } = render(<AgenciesFormElement />);

    // Act
    act(() => {
      const inputEmail = container.querySelector('input#email');
      fireEvent.change(inputEmail, { target: { value: '' } });

      const inputName = container.querySelector('input#name');
      fireEvent.change(inputName, { target: { value: 'Juan' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Perez' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => {
      return expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
    });
  });

  it('should show error message if name field is empty', async () => {
    // Arrange
    const { container, getByText } = render(<AgenciesFormElement />);

    // Act
    act(() => {
      const inputName = container.querySelector('input#name');
      fireEvent.change(inputName, { target: { value: '' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Perez' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => {
      return expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
    });
  });

  it('should show error message if lastname field is empty', async () => {
    // Arrange
    const { container, getByText } = render(<AgenciesFormElement />);

    // Act
    act(() => {
      const inputName = container.querySelector('input#name');
      fireEvent.change(inputName, { target: { value: 'Juan' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: '' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => {
      return expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
    });
  });

  it('should show error message if phone field is empty', async () => {
    // Arrange
    const { container, getByText } = render(<AgenciesFormElement />);

    // Act
    act(() => {
      const inputName = container.querySelector('input#name');
      fireEvent.change(inputName, { target: { value: 'Juan' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Perez' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '' } });
    });

    act(() => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    await waitFor(() => {
      return expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
    });
  });

  it('should show features list in agencies form', () => {
    //Arrange

    //Act
    const { container, getByText } = render(<AgenciesFormElement />);

    //Assert
    expect(getByText('agencies.feature_access')).toBeInTheDocument();
    expect(getByText('agencies.feature_admin')).toBeInTheDocument();
    expect(getByText('agencies.feature_custom')).toBeInTheDocument();
    expect(getByText('agencies.feature_reports')).toBeInTheDocument();
    expect(getByText('agencies.feature_consultancy')).toBeInTheDocument();
  });
});
