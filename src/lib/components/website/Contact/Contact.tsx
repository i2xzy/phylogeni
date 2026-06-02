'use client';

import { Input, Stack, Text, Textarea } from '@chakra-ui/react';
import emailjs from '@emailjs/browser';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import { Button } from '~/components/ui/button';
import { Field } from '~/components/ui/field';
import { toaster } from '~/components/ui/toaster';

const SERVICE_ID = 'service_096y1mn';
const TEMPLATE_ID = 'template_v1ctwus';
const USER_ID = 'user_lBkWUG1XdnTeZWL2QnHi6';

const Contact = () => {
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter your name'),
    email: Yup.string().email('Invalid email address').required('Required'),
    message: Yup.string().required('Please enter your comments'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    onSubmit: (values, { resetForm }) => {
      emailjs
        .send(SERVICE_ID, TEMPLATE_ID, values, USER_ID)
        .then(() => {
          toaster.create({
            title: 'Email sent',
            description: 'We will get back to you soon',
            type: 'success',
          });
          resetForm();
        })
        .catch((e) => setError(e.text));
    },
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap={4}>
        <Field label="Name">
          <Input
            id="name"
            name="name"
            placeholder="Name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </Field>
        <Field label="Email">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </Field>
        <Field label="Message">
          <Textarea
            placeholder="Comments..."
            name="message"
            onChange={formik.handleChange}
            value={formik.values.message}
            minH={200}
          />
        </Field>
        <Button type="submit" alignSelf="end">
          Send
        </Button>
        {error && (
          <Text color={{ base: 'red.500', _dark: 'red.300' }}>{error}</Text>
        )}
      </Stack>
    </form>
  );
};

export default Contact;
