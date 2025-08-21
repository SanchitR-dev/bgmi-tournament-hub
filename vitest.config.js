import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,ts}'],
    environment: 'node',
    globals: true,
    threads: false,
  },
})
