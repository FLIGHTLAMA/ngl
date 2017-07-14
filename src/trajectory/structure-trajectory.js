/**
 * @file Structure Trajectory
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */

import Trajectory from './trajectory.js'

class StructureTrajectory extends Trajectory {
  constructor (trajPath, structure, params) {
    super('', structure, params)
    this.saveInitialCoords()
  }

  get type () { return 'structure' }

  makeAtomIndices () {
    if (this.structure.atomSet.getSize() < this.structure.atomStore.count) {
      this.atomIndices = this.structure.getAtomIndices()
    } else {
      this.atomIndices = null
    }
  }

  _loadFrame (i, callback) {
    let coords
    const structure = this.structure
    const frame = structure.frames[ i ]

    if (this.atomIndices) {
      const indices = this.atomIndices
      const m = indices.length

      coords = new Float32Array(m * 3)

      for (let j = 0; j < m; ++j) {
        const j3 = j * 3
        const idx3 = indices[ j ] * 3

        coords[ j3 + 0 ] = frame[ idx3 + 0 ]
        coords[ j3 + 1 ] = frame[ idx3 + 1 ]
        coords[ j3 + 2 ] = frame[ idx3 + 2 ]
      }
    } else {
      coords = new Float32Array(frame)
    }

    const box = structure.boxes[ i ]
    const numframes = structure.frames.length

    this.process(i, box, coords, numframes)

    if (typeof callback === 'function') {
      callback()
    }
  }

  getNumframes () {
    this.setNumframes(this.structure.frames.length)
  }

  getPath (index, callback) {
    const n = this.numframes
    const k = index * 3

    const path = new Float32Array(n * 3)

    for (let i = 0; i < n; ++i) {
      const j = 3 * i
      const f = this.structure.frames[ i ]

      path[ j + 0 ] = f[ k + 0 ]
      path[ j + 1 ] = f[ k + 1 ]
      path[ j + 2 ] = f[ k + 2 ]
    }

    callback(path)
  }
}

export default StructureTrajectory
