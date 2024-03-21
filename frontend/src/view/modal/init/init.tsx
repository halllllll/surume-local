import { initDBTargets } from "@/service/entraid_info_api/type";
import { useState, type FC } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Box,
  Button,
  Text,
  CheckboxGroup,
  VStack,
  Checkbox,
  FormErrorMessage,
  Divider,
  Container,
  Heading,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Tag,
  HStack,
  TagLabel,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { InitSchema, InitSchemaType } from "./schema";
import { CheckBoxType } from "./type";
import { useInit } from "@/service/init";
import { InitTargetsRequest } from "@/service/init/type";

// Form いい感じのアーキテクチャができないのでいっそまとめる（あとで分割するいい方法が思いついたときに混乱しないように）

export const InitForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  // default values
  const dv = initDBTargets.reduce(
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    (acc, key) => ({ ...acc, [key]: false }),
    {} as CheckBoxType
  );
  // rhf
  const methods = useForm<InitSchemaType>({
    mode: "all",
    criteriaMode: "all",
    shouldFocusError: false,
    defaultValues: {
      target: dv,
    },
    resolver: yupResolver(InitSchema),
  });
  const targets = initDBTargets;

  const toast = useToast();

  // api
  const { mutate: postInitMutate } = useInit();

  // TODO: mutation
  const onFormSubmit: SubmitHandler<InitSchemaType> = (formData) => {
    // 送信に使用されるデータに整形
    const dto = Array.from(
      new Set(
        Object.entries(formData.target)
          .filter((v) => v[1] === true)
          .map((v) => v[0].trim())
      )
    ) as unknown as (typeof initDBTargets)[number][];
    console.log(dto);
    // ここからmutation
    // TODO
    const req: InitTargetsRequest = { target: dto };
    postInitMutate(req, {
      onSettled: () => {},
      onSuccess: () => {
        toast({
          title: "設定を削除しました",
          status: "info",
          isClosable: true,
          duration: 3000,
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: "失敗しました",
          description: `${error.name} - ${error.message}`,
          status: "error",
          isClosable: true,
          duration: 8000,
        });
      },
    });
  };

  // 慎重な削除処理のために二段構え
  const [isFire, setIsFire] = useState<boolean>(false);

  return (
    <>
      <ModalCloseButton />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onFormSubmit)}>
          <ModalBody pb={6}>
            <Box>
              <Text mb={5}>Check to delete data</Text>
            </Box>
            <FormControl
              isInvalid={methods.formState.errors.target !== undefined}
            >
              <FormLabel>settings</FormLabel>
              <Controller
                name={"target"}
                control={methods.control}
                defaultValue={dv}
                // render={({ field: { ref, ...rest } }) =>　ビルドエラー回避のためにコメントアウトした
                // ↓じゃなくて↑がほんとは正しそう
                // biome-ignore lint/correctness/noEmptyPattern: <explanation>
                render={({}) => (
                  <VStack align={"start"} spacing={4}>
                    <CheckboxGroup size={"lg"}>
                      {targets.map((t, _) => {
                        return (
                          <Checkbox
                            {...methods.register(`target.${t}`)}
                            key={`${t}`}
                            spacing={6}
                            disabled={isFire}
                          >
                            {t}
                          </Checkbox>
                        );
                      })}
                    </CheckboxGroup>
                  </VStack>
                )}
              />
              <FormErrorMessage>
                {methods.formState.errors.root?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              // type="submit"
              colorScheme="red"
              isDisabled={!methods.formState.isValid || isFire}
              isLoading={methods.formState.isLoading}
              loadingText="submitting..."
              spinnerPlacement="start"
              onClick={() => {
                setIsFire(true);
              }}
            >
              DELETE
            </Button>
          </ModalFooter>
          {isFire && (
            <>
              <Container my={3}>
                <VStack spacing={3} alignContent={"center"}>
                  <Divider />
                  <Heading size={"lg"}>👺👈🧨</Heading>
                  <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <VStack direction={"column"}>
                      <AlertIcon />
                      <AlertTitle>Here's looking at you, kid.</AlertTitle>
                      <AlertDescription border={"1"}>
                        <HStack spacing={5}>
                          {Object.entries(methods.getValues().target).map(
                            (v, _i) => {
                              if (v[1]) {
                                return (
                                  <Tag
                                    key={`${v}`}
                                    size={"lg"}
                                    variant="solid"
                                    colorScheme="red"
                                    borderRadius="full"
                                  >
                                    <TagLabel>{v[0]}</TagLabel>
                                  </Tag>
                                );
                              }
                            }
                          )}
                        </HStack>
                      </AlertDescription>
                    </VStack>
                  </Alert>
                  <HStack>
                    <Button
                      colorScheme={"blue"}
                      size={"lg"}
                      onClick={() => {
                        setIsFire(false);
                        onClose();
                      }}
                    >
                      rethink
                    </Button>
                    <Spacer />
                    <Button type={"submit"} size={"sm"}>
                      delete
                    </Button>
                  </HStack>
                </VStack>
              </Container>
            </>
          )}
        </form>
      </FormProvider>
    </>
  );
};
