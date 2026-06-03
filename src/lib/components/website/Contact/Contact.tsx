'use client';

import { Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '~/components/ui/button';
import { Field } from '~/components/ui/field';
import { toaster } from '~/components/ui/toaster';
import { createClient } from '~/lib/utils/supabase/client';

// Fixed-height error line so the layout doesn't shift as errors appear/clear.
const FieldError = ({ children }: { children?: React.ReactNode }) => (
  <Text
    mt={-1}
    minH="0.75rem"
    lineHeight="0.75rem"
    fontSize="xs"
    color="fg.error"
  >
    {children}
  </Text>
);

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Invalid email address').required('Required'),
  message: Yup.string().required('Please enter your message'),
});

const Contact = () => {
  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const supabase = createClient();
      const { error } = await supabase.from('contact_messages').insert({
        name: values.name,
        email: values.email,
        message: values.message,
      });

      if (error) {
        toaster.create({
          title: 'Could not send your message',
          description: 'Please try again in a moment.',
          type: 'error',
        });
        return;
      }

      toaster.create({
        title: 'Message sent',
        description: "Thanks for reaching out. We'll get back to you.",
        type: 'success',
      });
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap={3}>
        <Heading size="lg" fontWeight="normal">
          Or send us a message
        </Heading>
        <Field
          label="Name"
          invalid={!!(formik.touched.name && formik.errors.name)}
        >
          <Input
            name="name"
            placeholder="Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          <FieldError>{formik.touched.name && formik.errors.name}</FieldError>
        </Field>
        <Field
          label="Email"
          invalid={!!(formik.touched.email && formik.errors.email)}
        >
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <FieldError>{formik.touched.email && formik.errors.email}</FieldError>
        </Field>
        <Field
          label="Message"
          invalid={!!(formik.touched.message && formik.errors.message)}
        >
          <Textarea
            name="message"
            placeholder="How can we help?"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
            minH={200}
          />
          <FieldError>
            {formik.touched.message && formik.errors.message}
          </FieldError>
        </Field>
        <Button type="submit" alignSelf="end" loading={formik.isSubmitting}>
          Send
        </Button>
      </Stack>
    </form>
  );
};

export default Contact;
