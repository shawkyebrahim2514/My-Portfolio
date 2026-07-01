import React, {useRef, useState} from 'react'
import {
  Card,
  Container,
  Button,
  Flex,
  Label,
  Heading,
  Text,
  Stack,
  useElementSize,
  useTheme,
} from '@sanity/ui'
import {CloseIcon} from '@sanity/icons'

export const GetStartedTutorial = () => {
  const [hideTutorial, setShowTutorial] = useState(
    window.localStorage.getItem('getstarted_closedTutorial') !== null
  )

  const {sanity} = useTheme()
  const rootElement = useRef(null)
  const rect = useElementSize(rootElement.current)
  const width = rect?.content?.width
  const isSmallScreen = width ? width < sanity.media[1] : false
  const isProdEnv = process.env.NODE_ENV !== 'development'

  const onClose = () => {
    window.localStorage.setItem('getstarted_closedTutorial', 'true')
    setShowTutorial(true)
  }

  if (hideTutorial || isProdEnv) {
    return null
  }

  return (
    <div ref={rootElement}>
      <Card tone="primary" padding={isSmallScreen ? 3 : 5} paddingBottom={isSmallScreen ? 4 : 6}>
        <Flex justify={isSmallScreen ? 'space-between' : 'flex-end'} align="center">
          {isSmallScreen && <Label as="p">Your Sanity Studio is all set up!</Label>}

          <Button
            aria-label="Close dialog"
            icon={CloseIcon}
            mode="bleed"
            onClick={onClose}
            padding={isSmallScreen ? undefined : 3}
          />
        </Flex>
        <Stack space={5}>
          {!isSmallScreen && (
            <>
              <Label as="p" align="center">
                Get started with sanity
              </Label>

              <Heading as="h1" size={4} align="center">
                Your Sanity Studio is all set up!
              </Heading>
            </>
          )}

          <Container width={1}>
            <Text
              as="p"
              size={isSmallScreen ? 1 : undefined}
              align={isSmallScreen ? 'left' : 'center'}
            >
              Next, our docs will guide you through building schemas, adding content, and connecting
              a frontend. You’ll see updates reflected in your Studio below.
            </Text>
          </Container>

          <Flex justify={isSmallScreen ? 'flex-start' : 'center'}>
            <Button
              as="a"
              href="https://www.sanity.io/docs/create-a-schema-and-configure-sanity-studio"
              target="_blank"
              padding={isSmallScreen ? undefined : 4}
              tone="primary"
              text="Build a schema"
            />
          </Flex>
        </Stack>
      </Card>
    </div>
  )
}
