# arm-none-eabi-gcc

<p align="center">
  <a href="https://github.com/ryanwinter/rx-elf-gcc/actions"><img alt="action status" src="https://github.com/ryanwinter/rx-elf-gcc/workflows/CI/badge.svg"></a>
</p>

This action downloads and sets up rx-elf-gcc, adding it to the PATH. It works on Windows.

## Usage

```yaml
steps:
- name: rx-elf-gcc
- uses: ryanwinter/rx-elf-gcc@main
  with:
    release: '8.3.0.202004'
- run: ...
```
