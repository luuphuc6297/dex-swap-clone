import { Flex, IconButton, useModal } from '@pancakeswap/uikit'
import TailwindSetting from 'components/Svg/Tailwind-SVG/TailwindSetting'
import SettingsModal from './SettingsModal'

// import {}
type Props = {
    color?: string
    mr?: string
    mode?: string
}

const GlobalSettings = ({ color, mr = '8px', mode }: Props) => {
    const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

    return (
        <Flex>
            <IconButton
                onClick={onPresentSettingsModal}
                variant="text"
                scale="sm"
                mr={mr}
                id={`open-settings-dialog-button-${mode}`}
            >
                <TailwindSetting />
            </IconButton>
        </Flex>
    )
}

export default GlobalSettings
