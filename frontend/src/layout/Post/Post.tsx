import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { type FC } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { ChatMessageData } from "@/types/types";
import { usePostChatMessageText } from "@/service/message";

// 面倒なのでyupとかは使わない
export const Post: FC = () => {
  const methods = useForm<ChatMessageData>({
    mode: "all",
    defaultValues: {
      chatId: "",
      content: "BIG LOVE",
    },
  });

  const { mutate: postChatMessage } = usePostChatMessageText();
  const toast = useToast();

  const post: SubmitHandler<ChatMessageData> = (formData) => {
    postChatMessage(
      { ...formData },
      {
        onSuccess: (result) => {
          console.log(result);
          toast({
            title: "success",
            description: `${result.webUrl}`, // TODO: nullになるがあとで調査する。不要ではある
            status: "success",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: error.name,
            description: error.message,
            status: "error",
          });
        },
      }
    );
  };

  return (
    <Box>
      <Box my={2}>
        <Center>
          <Heading as={"h2"} size={"lg"}>
            Manual Post
          </Heading>
        </Center>
        <Center>
          <Box w="max-content">
            <Alert status="info">
              <AlertIcon />
              here is developmental poc view
            </Alert>
          </Box>
        </Center>
      </Box>
      <Center>
        <Box borderRadius={10} borderColor={"beige"} borderWidth={3} p={5}>
          <form onSubmit={methods.handleSubmit(post)}>
            <VStack spacing={4}>
              <FormControl
                isRequired
                isInvalid={methods.formState.errors.chatId !== undefined}
              >
                <HStack>
                  <FormLabel w="max-content" overflowWrap={"unset"}>
                    chat id
                  </FormLabel>
                  <Input
                    {...methods.register("chatId", {
                      required: "required",
                    })}
                  />
                </HStack>
                <FormErrorMessage>
                  {methods.formState.errors.chatId?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={methods.formState.errors.content !== undefined}
              >
                <FormLabel>content (plane text)</FormLabel>
                <Textarea
                  {...methods.register("content", {
                    required: "required",
                    minLength: {
                      value: 3,
                      message: "minimum length should be 3 letters",
                    },
                  })}
                  required
                />
                <FormErrorMessage>
                  {methods.formState.errors.content?.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                isDisabled={!methods.formState.isValid}
                isLoading={methods.formState.isLoading}
                loadingText="submitting"
                spinnerPlacement="start"
              >
                NEW CHAT MESSAGE
              </Button>
            </VStack>
          </form>
        </Box>
      </Center>
    </Box>
  );
};
